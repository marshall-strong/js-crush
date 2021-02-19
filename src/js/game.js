// import Grid from "./grid";
// import themes from "./themes";

class Game {
  constructor(gameCanvas) {
    this.canvas = gameCanvas;
    this.context = this.canvas.getContext("2d");
    this.canvasWidth = 600;
    this.canvasHeight = 600;

    this.gridSize = 8;
    this.gameboard = new Grid(this.gridSize);
    this.squareWidth = this.canvasWidth / this.gridSize;
    this.squareHeight = this.canvasHeight / this.gridSize;

    // initializing, running, ready
    this.status = "initializing";

    this.matchesExist = false;

    this.mousedownGem = null;
    this.mouseupGem = null;
    this.firstGem = null;

    this.keepScore = false;
    this.points = 0;
    this.totalGemsRemoved = 0;
    this.lastGemValue = null;

    this.theme = themes.animals;
  }

  // triggered by jQuery functions in `index.js`
  setMousedownGem(mousedownEvent) {
    this.mousedownGem = this.getMouseEventGem(mousedownEvent);
  }

  setMouseupGem(mouseupEvent) {
    this.mouseupGem = this.getMouseEventGem(mouseupEvent);
  }

  reset() {
    $("#mainColumn").html(this.drawGameboard());
    this.gameboard = new Grid(this.gridSize);
    this.keepScore = false;
    let emptySquares = true;
    while (emptySquares) {
      // iterates through gameboard and add gems to empty squares
      for (let row = 0; row < this.gridSize; row++) {
        for (let col = 0; col < this.gridSize; col++) {
          if (!this.gameboard.gem(col, row)) this.gameboard.addGem(col, row);
        }
      }
      $("#mainColumn").html(this.drawGameboard());
      // removes any matches
      const matches = this.findMatches(this.gameboard);
      if (matches.length > 0) {
        const gems = [].concat.apply([], matches);
        this.gameboard.removeGems(gems);
      } else {
        emptySquares = false;
      }
    }
    this.clearScore();
    $("#mainColumn").html(this.drawGameboard());
  }

  ////////////////////////////////////////////////
  // get a move from the player
  getMouseEventGem(mouseEvent) {
    const canvas = document.getElementById("gameCanvas");
    const canvasRect = canvas.getBoundingClientRect();
    // mouseEvent coordinates relative to application viewport
    const xViewport = mouseEvent.clientX;
    const yViewport = mouseEvent.clientY;
    // mouseEvent coordinates relative to gameCanvas
    const xCanvas = xViewport - canvasRect.left;
    const yCanvas = yViewport - canvasRect.top;
    // get the indexes of the gameboard col and row at (xCanvas, yCanvas)
    const colIndex = Math.floor(xCanvas / this.squareWidth);
    const rowIndex = Math.floor(yCanvas / this.squareHeight);
    // get the gem
    const gem = this.gameboard.gem(colIndex, rowIndex);
    return gem;
  }

  checkMouseEvent() {
    // only checks mouse events if there are gems on the board
    if (this.mousedownGem && this.mouseupGem) {
      // determines if the mouseEvent was a click or a drag
      if (this.mousedownGem === this.mouseupGem) {
        this.handleClick();
      } else {
        this.handleDrag();
      }
    }
  }

  handleClick() {
    if (!this.firstGem) {
      this.firstGem = this.mousedownGem;
      this.highlight(this.firstGem);
    } else {
      const firstGem = this.firstGem;
      this.firstGem = null;
      const secondGem = this.mousedownGem;
      this.highlight(secondGem);
      this.checkMove(firstGem, secondGem);
    }
  }

  handleDrag() {
    if (this.mousedownGem && this.mouseupGem) {
      this.firstGem = null;
      this.checkMove(this.mousedownGem, this.mouseupGem);
    }
  }

  ////////////////////////////////////////////////
  // trigger the appropriate animation for a move
  checkMove(gem1, gem2) {
    const gem1Adjacent = this.gameboard.adjacent(gem1);
    if (!(gem1Adjacent.indexOf(gem2) >= 0)) {
      this.handleNonAdjacentMove(gem1, gem2);
    } else {
      const matchesMade = this.findMatchesMade(gem1, gem2);
      if (matchesMade.length > 0) {
        this.handleMatchingMove(gem1, gem2);
        this.matchesExist = true;
        this.removeMatchesUntilStable();
      } else {
        this.handleNonMatchingMove(gem1, gem2);
      }
    }
  }

  handleNonAdjacentMove(gem1, gem2) {
    setTimeout(() => {
      this.shake(gem1, gem2);
      this.drawGameboard();
    }, 550);
  }

  handleNonMatchingMove(gem1, gem2) {
    setTimeout(() => {
      this.swap(gem1, gem2);
      setTimeout(() => {
        this.shake(gem1, gem2);
        this.swap(gem2, gem1);
      }, 550);
    }, 550);
  }

  handleMatchingMove(gem1, gem2) {
    setTimeout(() => this.swap(gem1, gem2), 550);
  }

  ////////////////////////////////////////////////
  // update the player's score
  updateScore(matches) {
    const multiplier = matches.length;
    const gems = [].concat.apply([], matches);
    this.points = this.points + multiplier * gems.length;
    this.totalGemsRemoved = totalGemsRemoved + gems.length;
    this.lastGemValue = gems[0].value;
  }

  clearScore() {
    this.points = 0;
    this.totalGemsRemoved = 0;
    this.lastGemValue = null;
  }

  drawGameboard() {
    // draw grid container
    this.context.clearRect(0, 0, 600, 600);
    this.context.strokeStyle = "white";
    // iterate through grid squares
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const x = col * this.squareWidth;
        const y = row * this.squareWidth;
        const width = this.squareWidth;
        const height = this.squareHeight;
        // draw square outline
        this.context.strokeRect(x, y, width, height);
        // draw gem, if it exists
        const gem = this.gameboard.gem(col, row);
        if (gem) {
          const themeValue = this.theme[gem.value];
          const image = document.getElementById(themeValue);
          this.context.drawImage(image, x, y, width, height);
        }
      }
    }
  }

  ////////////////////////////////////////////////
  // GAME LOGIC

  // A match occurs when 3 or more consecutive gems in a row or col have the same value.
  // Matches are returned as arrays, where each element is a gem in the match.
  // Overlapping horizontal and vertical matches for the same gem value are joined.

  // `findMatches` accepts a `gameboard` to search for matches
  // `findMatches` returns all matches on the `gameboard` as an array of arrays.

  // Implemented with a (not fully optimized) Tarjan's union-find algorithm.
  // Implementation of the classic union-find algorithm (unoptimized).
  // Allows any string keys to be unioned into a set of disjoint sets.
  // https://en.wikipedia.org/wiki/Disjoint-set_data_structure

  findMatches(gameboard) {
    let unioned = {};
    let setSizes = {};
    let col, row;
    const horizontalStreaks = [];
    const verticalStreaks = [];

    // Finds the set representative for the set that this key is a member of.
    function find(key) {
      let parent = unioned[key];
      if (parent == null) return key;
      parent = find(parent);
      unioned[key] = parent; // path compression
      return parent;
    }

    // Returns the size of the set represented by `found` -- assumes 1 if not stored.
    function setSize(found) {
      return setSizes[found] || 1;
    }

    // Ensures that both keys are in the same set, joining the sets if needed.
    // http://stackoverflow.com/a/2326676/265298
    function union(key1, key2) {
      let parent1 = find(key1);
      let parent2 = find(key2);
      if (parent1 == parent2) {
        return parent1;
      } else {
        unioned[parent2] = parent1;
        setSizes[parent1] = setSize(parent1) + setSize(parent2);
        delete setSizes[parent2];
      }
    }

    // Iterates through each `gameboard` row and adds streaks of 2+ gems to `horizontalStreaks`.
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const gem = gameboard.gem(col, row);
        if (!gem) {
          continue;
        } else {
          let streak = [gem];
          let nextCol = col + 1;
          while (nextCol < this.gridSize) {
            const nextGem = gameboard.gem(nextCol, row);
            if (!nextGem || nextGem.value != gem.value) {
              break;
            } else {
              streak.push(nextGem);
              nextCol++;
            }
          }
          if (streak.length >= 2) horizontalStreaks.push(streak);
        }
      }
    }

    // Iterates through each `gameboard` col and adds streaks of 2+ gems to `verticalStreaks`.
    for (let col = 0; col < this.gridSize; col++) {
      for (let row = 0; row < this.gridSize; row++) {
        const gem = gameboard.gem(col, row);
        if (!gem) {
          continue;
        } else {
          const streak = [gem];
          let nextRow = row + 1;
          while (nextRow < this.gridSize) {
            const nextGem = gameboard.gem(col, nextRow);
            if (!nextGem || nextGem.value != gem.value) {
              break;
            } else {
              streak.push(nextGem);
              nextRow++;
            }
          }
          if (streak.length >= 2) verticalStreaks.push(streak);
        }
      }
    }

    // Executes a union of the horizontal and vertical streaks, joining any that overlap.
    const streaks = horizontalStreaks.concat(verticalStreaks);
    for (let i = 0; i < streaks.length; i++) {
      const streak = streaks[i];
      for (let j = 1; j < streak.length; j++) {
        const gem1 = streak[0];
        const gem2 = streak[j];
        union(gem1.id, gem2.id);
      }
    }

    // Lists out post-union matches (streaks that are >= 3)
    // In the future, this step could handle "special candies"
    let matchesObj = {};
    for (row = 0; row < this.gridSize; row++) {
      for (col = 0; col < this.gridSize; col++) {
        const gem = gameboard.gem(col, row);
        if (gem) {
          const streak = find(gem.id);
          if (setSize(streak) >= 3) {
            if (streak in matchesObj) {
              matchesObj[streak].push(gem);
            } else {
              matchesObj[streak] = [gem];
            }
          }
        }
      }
    }

    // Returns `matches` as an array of arrays of gems.
    const matches = [];
    for (const key in matchesObj) {
      matches.push(matchesObj[key]);
    }
    return matches;
  }

  // Duplicates `this.gameboard`, exchanges the two gems, then finds matches.
  findMatchesMade(gem1, gem2) {
    const newGameboard = new Grid(this.gridSize);
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const gem = this.gameboard.gem(col, row);
        newGameboard.setGemPosition(gem, col, row);
      }
    }
    newGameboard.exchange(gem1, gem2);
    return this.findMatches(newGameboard);
  }

  fadeOutMatches(matches) {
    const gems = [].concat.apply([], matches);

    this.context.save();
    let counter = 10;

    const fade = setInterval(() => {
      // every time the counter decreases, we increase the gems' transparency
      counter--;
      this.context.globalAlpha = counter / 10;
      // draw each gem
      for (let i = 0; i < gems.length; i++) {
        const gem = gems[i];
        const x = gem.col() * this.squareWidth;
        const y = gem.row() * this.squareHeight;
        const width = this.squareWidth;
        const height = this.squareHeight;
        // erase the current image
        this.context.clearRect(x, y, width, height);
        const gemTheme = this.theme[gem.value];
        const gemImage = document.getElementById(gemTheme);
        // draw the new image @ +10% transparency
        this.context.drawImage(gemImage, x, y, width, height);
      }
      if (counter <= 0) {
        clearInterval(fade);
        this.context.restore();
        this.removeMatches(matches);
      }
    }, 50);
  }

  // Removes gems in `matches` from `this.gameboard` and updates score.
  // Does not replace removed gems or move remaining gems down.
  removeMatches(matches) {
    const gems = [].concat.apply([], matches);
    this.gameboard.removeGems(gems);
    $("#mainColumn").html(this.drawGameboard());
    this.gravity();
  }

  // Shifts all gems above the specified square down one row.
  shiftColDown(col, rowInitial) {
    for (let row = rowInitial; row > 0; row--) {
      const gem = this.gameboard.gem(col, row - 1);
      console.log(`in col ${col}, move gem at row ${row - 1} to row ${row}.`);
      console.log(gem);
      console.log("---");
      this.gameboard.setGemPosition(gem, col, row);
    }
  }

  // Iterates through gameboard rows, starting with the top row
  // If a gap is found, all gems above it are shifted downward,
  // a new gem is added to the top row, and the game pauses before redrawing,
  // making the gems appear to fall downward.
  gravity() {
    for (let row = 0; row < this.gridSize; row++) {
      let gapFound = false;
      for (let col = 0; col < this.gridSize; col++) {
        if (this.gameboard.gem(col, row)) {
          continue;
        } else {
          this.shiftColDown(col, row);
          this.gameboard.addGem(col, 0);
          gapFound = true;
        }
      }
      const delay = gapFound ? 500 : null;
      setTimeout(() => $("#mainColumn").html(this.drawGameboard()), delay);
    }
    this.checkForMatches();
  }

  checkForMatches() {
    const matches = this.findMatches(this.gameboard);
    if (matches.length > 0) {
      this.matchesExist = true;
    } else {
      this.matchesExist = false;
      this.status = "ready";
      console.log("ready for next move");
    }
  }

  // Continually checks for matches until the gameboard reaches a stable state.
  removeMatchesUntilStable() {
    const keepChecking = setInterval(() => {
      if (this.matchesExist) {
        const matches = this.findMatches(this.gameboard);
        // cascades all the other actions as well
        this.fadeOutMatches(matches);
        // culminates with `checkForMatches()`, which sets `this.matchesExist`
      } else {
        clearInterval(keepChecking);
      }
    }, 1000);
  }

  autoMove() {}

  shuffle() {
    this.gameboard.randomize();
    $("#mainColumn").html(this.drawGameboard());
  }

  ////////////////////////////////////////////////
  // GEM ANIMATIONS
  highlight(gem) {
    this.context.save();
    this.context.globalAlpha = 0.3;
    this.context.fillStyle = "yellow";
    const squareX = gem.col() * this.squareWidth;
    const squareY = gem.row() * this.squareHeight;
    this.context.fillRect(
      squareX,
      squareY,
      this.squareWidth,
      this.squareHeight
    );
    this.context.restore();
  }

  swap(gem1, gem2) {
    const gem1Movement = this.gameboard.relativePosition(gem1, gem2);
    if (gem1Movement === "right" || gem1Movement === "left") {
      this.horizontalSwap(gem1, gem2, gem1Movement);
    } else if (gem1Movement === "down" || gem1Movement === "up") {
      this.verticalSwap(gem1, gem2, gem1Movement);
    }
  }

  clearHorizontal(gem1, gem2, gem1Movement) {
    let left;
    const top = gem1.row() * this.squareHeight;
    const width = 2 * this.squareWidth;
    const height = this.squareHeight;
    if (gem1Movement === "right") {
      left = gem1.col() * this.squareWidth;
    } else if (gem1Movement === "left") {
      left = gem2.col() * this.squareWidth;
    }
    this.context.clearRect(left, top, width, height);
  }

  clearVertical(gem1, gem2, gem1Movement) {
    const left = gem1.col() * this.squareWidth;
    let top;
    const width = this.squareWidth;
    const height = 2 * this.squareHeight;
    if (gem1Movement === "down") {
      top = gem1.row() * this.squareHeight;
    } else if (gem1Movement === "up") {
      top = gem2.row() * this.squareHeight;
    }
    this.context.clearRect(left, top, width, height);
  }

  horizontalSwap(gem1, gem2, gem1Movement) {
    // set gem parameters that are constant during animation
    const gem1Theme = this.theme[gem1.value];
    const gem1Image = document.getElementById(gem1Theme);
    const gem1LeftInitial = gem1.col() * this.squareWidth;
    const gem1Top = gem1.row() * this.squareHeight;
    const gem2Theme = this.theme[gem2.value];
    const gem2Image = document.getElementById(gem2Theme);
    const gem2LeftInitial = gem2.col() * this.squareWidth;
    const gem2Top = gem2.row() * this.squareHeight;
    const width = this.squareWidth;
    const height = this.squareHeight;
    // initialize gem parameters that change during animation
    let timer = 0;
    let gem1LeftOffset, gem1Left;
    let gem2LeftOffset, gem2Left;
    // horizontal swap animation
    const hSwap = setInterval(() => {
      // update gem1 parameters
      if (gem1Movement === "right") {
        gem1LeftOffset = (timer * this.squareWidth) / 20;
      } else if (gem1Movement === "left") {
        gem1LeftOffset = (-1 * timer * this.squareWidth) / 20;
      }
      gem1Left = gem1LeftInitial + gem1LeftOffset;
      // update gem2 parameters
      if (gem1Movement === "right") {
        gem2LeftOffset = (-1 * timer * this.squareWidth) / 20;
      } else if (gem1Movement === "left") {
        gem2LeftOffset = (timer * this.squareWidth) / 20;
      }
      gem2Left = gem2LeftInitial + gem2LeftOffset;
      // clear previous drawings
      this.clearHorizontal(gem1, gem2, gem1Movement);
      // increment timer (first animation frame is for timer=1)
      timer++;
      // draw gem1 with updated parameters
      this.context.drawImage(gem1Image, gem1Left, gem1Top, width, height);
      // draw gem2 with updated parameters
      this.context.drawImage(gem2Image, gem2Left, gem2Top, width, height);
      // exit after 20 intervals, once the gems have swapped positions
      if (timer >= 20) {
        clearInterval(hSwap);
        // update the gems' positions in the gameboard state
        this.gameboard.exchange(gem1, gem2);
        // redraw the gameboard
        $("#mainColumn").html(this.drawGameboard());
      }
    }, 10);
  }

  verticalSwap(gem1, gem2, gem1Movement) {
    // set gem parameters that are constant during animation
    const gem1Theme = this.theme[gem1.value];
    const gem1Image = document.getElementById(gem1Theme);
    const gem1Left = gem1.col() * this.squareWidth;
    const gem1TopInitial = gem1.row() * this.squareHeight;
    const gem2Theme = this.theme[gem2.value];
    const gem2Image = document.getElementById(gem2Theme);
    const gem2Left = gem2.col() * this.squareWidth;
    const gem2TopInitial = gem2.row() * this.squareHeight;
    const width = this.squareWidth;
    const height = this.squareHeight;
    // initialize gem parameters that change during animation
    let timer = 0;
    let gem1TopOffset, gem1Top;
    let gem2TopOffset, gem2Top;
    // vertical swap animation
    const vSwap = setInterval(() => {
      // update gem1 parameters
      if (gem1Movement === "down") {
        gem1TopOffset = (timer * this.squareHeight) / 20;
      } else if (gem1Movement === "up") {
        gem1TopOffset = (-1 * timer * this.squareHeight) / 20;
      }
      gem1Top = gem1TopInitial + gem1TopOffset;
      // update gem2 parameters
      if (gem1Movement === "down") {
        gem2TopOffset = (-1 * timer * this.squareHeight) / 20;
      } else if (gem1Movement === "up") {
        gem2TopOffset = (timer * this.squareHeight) / 20;
      }
      gem2Top = gem2TopInitial + gem2TopOffset;
      // clear previous drawings
      this.clearVertical(gem1, gem2, gem1Movement);
      // increment timer (first animation frame is for timer=1)
      timer++;
      // draw gem1 with updated parameters
      this.context.drawImage(gem1Image, gem1Left, gem1Top, width, height);
      // draw gem2 with updated parameters
      this.context.drawImage(gem2Image, gem2Left, gem2Top, width, height);
      // exit after 20 intervals, once the gems have swapped positions
      if (timer >= 20) {
        clearInterval(vSwap);
        // update the gems' positions in the gameboard state
        this.gameboard.exchange(gem1, gem2);
        // redraw the gameboard
        $("#mainColumn").html(this.drawGameboard());
      }
    }, 10);
  }

  shake(gem1, gem2) {
    $(gameCanvas).addClass("shake");
    console.log("shake");
    setTimeout(() => $(gameCanvas).removeClass("shake"), 200);
  }
}
