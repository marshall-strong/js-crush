class Game {
  constructor(gameCanvas) {
    this.canvas = gameCanvas;
    this.context = this.canvas.getContext("2d");
    this.canvasWidth = 600;
    this.canvasHeight = 600;

    this.gridSize = 8;
    this.gameboard = new Board(this.gridSize);
    this.squareWidth = this.canvasWidth / this.gridSize;
    this.squareHeight = this.canvasHeight / this.gridSize;

    // initializing, running, ready
    this.status = "initializing";

    this.matchesExist = false;
    this.matchingMoves = [];

    this.mousedownGem = null;
    this.mouseupGem = null;
    this.firstGem = null;

    this.pointsEarned = 0;
    this.totalPoints = 0;
    this.totalGemsRemoved = 0;
    this.lastGemValue = null;

    this.theme = themes.animals;
  }

  // Called at setup, and when "New Game" is clicked.
  resetGame() {
    $("#mainColumn").html(this.drawGameboard());
    this.gameboard = new Board(this.gridSize);
    let emptySquares = true;
    while (emptySquares) {
      for (let row = 0; row < this.gridSize; row++) {
        for (let col = 0; col < this.gridSize; col++) {
          if (!this.gameboard.gem(col, row)) this.gameboard.addNewGem(col, row);
        }
      }
      $("#mainColumn").html(this.drawGameboard());
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
    this.checkForMoves();
  }

  // Triggered by user mouseEvents,
  // triggers `checkMouseEvent()`.
  setMouseEventGem(mouseEvent) {
    // finds mouseEvent coordinates relative to application viewport
    const xViewport = mouseEvent.clientX;
    const yViewport = mouseEvent.clientY;
    // finds mouseEvent coordinates relative to game.canvas
    const canvasRect = this.canvas.getBoundingClientRect();
    const xCanvas = xViewport - canvasRect.left;
    const yCanvas = yViewport - canvasRect.top;
    // finds the gem at the mouseEvent's canvas coordinates
    const col = Math.floor(xCanvas / this.squareWidth);
    const row = Math.floor(yCanvas / this.squareHeight);
    const gem = this.gameboard.gem(col, row);
    // update this.mousedownGem/this.mouseupGem, then check the mouseEvent
    if (mouseEvent.type === "mousedown") {
      this.mousedownGem = gem;
    } else if (mouseEvent.type === "mouseup") {
      this.mouseupGem = gem;
      this.checkMouseEvent();
    }
  }

  // Triggered by `setMouseEventGem(mouseup)`,
  // triggers `highlight(gem)` and `checkMove(mousedownGem, mouseupGem).
  checkMouseEvent() {
    // only checks mouse events if there are gems on the board
    if (this.mousedownGem && this.mouseupGem) {
      if (this.mousedownGem === this.mouseupGem) {
        // handles clicks
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
      } else {
        // handles drags
        this.firstGem = null;
        this.checkMove(this.mousedownGem, this.mouseupGem);
      }
    }
  }

  // Triggered by checkMouseEvent,
  // triggers the appropriate animations.
  checkMove(gem1, gem2) {
    const gem1Adjacent = this.gameboard.adjacentGems(gem1);
    if (!(gem1Adjacent.indexOf(gem2) >= 0)) {
      // handles non-adjacent moves
      setTimeout(() => {
        this.shake(gem1, gem2);
        this.drawGameboard();
      }, 550);
    } else {
      const matchesMade = this.findMatchesMade(gem1, gem2);
      if (matchesMade.length > 0) {
        // handles adjacent, matching moves
        setTimeout(() => {
          this.swap(gem1, gem2);
          this.matchesExist = true;
          this.removeMatchesUntilStable();
        }, 300);
      } else {
        // handles adjacent, non-matching moves
        setTimeout(() => {
          this.swap(gem1, gem2);
          setTimeout(() => {
            this.shake(gem1, gem2);
            this.swap(gem2, gem1);
          }, 550);
        }, 300);
      }
    }
  }

  // score
  updateScore(matches) {
    const multiplier = matches.length;
    const gems = [].concat.apply([], matches);
    this.pointsEarned = gems.length * multiplier * 40;
    this.totalPoints = this.totalPoints + this.pointsEarned;
    this.totalGemsRemoved = this.totalGemsRemoved + gems.length;
    this.lastGemValue = gems[0].value;
    $(this).triggerHandler("scoreUpdate");
  }

  clearScore() {
    this.pointsEarned = 0;
    this.totalPoints = 0;
    this.totalGemsRemoved = 0;
    this.lastGemValue = null;
    $(this).triggerHandler("scoreUpdate");
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

    // Iterates through each `gameboard` row and adds streaks of 3+ gems to `horizontalStreaks`.
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
          if (streak.length >= 3) horizontalStreaks.push(streak);
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
    const newGameboard = new Board(this.gridSize);
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const gem = this.gameboard.gem(col, row);
        newGameboard.updateGem(gem, col, row);
      }
    }
    newGameboard.swapGems(gem1, gem2);
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
        this.updateScore(matches);
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
      this.gameboard.updateGem(gem, col, row);
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
          this.gameboard.addNewGem(col, 0);
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
      this.checkForMoves();
    }
  }

  // Gets called at the very end of the game logic cycle.
  // Triggers `game.shuffle()` if no more matches can be made.
  checkForMoves() {
    const matchingMoves = this.getAllMatchingMoves();
    if (matchingMoves.length > 0) {
      this.matchingMoves = matchingMoves;
      this.status = "ready";
      console.log("ready for next move");
    } else {
      this.matchingMoves = [];
      console.log("no remaining moves -- shuffling!");
      this.shuffle();
    }
  }

  // Iterates through every gameboard square and checks each direction.
  // Returns an array of all matching moves that can be made.
  // Each move is represented as an object: move = { gem1, gem2 }
  getAllMatchingMoves() {
    const matchingMoves = [];
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const gem1 = this.gameboard.gem(col, row);
        const gem1Adjacent = this.gameboard.adjacentGems(gem1);
        for (let i = 0; i < gem1Adjacent.length; i++) {
          const gem2 = gem1Adjacent[i];
          const matchesMade = this.findMatchesMade(gem1, gem2);
          if (matchesMade.length > 0) {
            const matchingMove = { gem1: gem1, gem2: gem2 };
            matchingMoves.push(matchingMove);
          }
        }
      }
    }
    return matchingMoves;
  }

  // used by the "Get Hint" button
  showRandomMove() {
    this.context.clearRect(0, 0, 600, 600);
    $("#mainColumn").html(this.drawGameboard());

    const i = Math.floor(this.matchingMoves.length * Math.random());
    const move = this.matchingMoves[i];
    const { gem1, gem2 } = move;
    console.log(
      `swap gem1 at (col ${gem1.col()}, row ${gem1.row()}) with gem2 at (col ${gem2.col()}, row ${gem2.row()})`
    );

    const xGem1 = this.squareWidth * gem1.col();
    const yGem1 = this.squareHeight * gem1.row();
    const quad = 0.25 * this.squareWidth;
    let xStart, yStart;

    this.context.save();

    this.context.clearRect(0, 0, 600, 600);
    $("#mainColumn").html(this.drawGameboard());

    this.context.strokeStyle = "black";
    const moveDir = this.gameboard.relativePosition(gem1, gem2);

    if (moveDir === "right") {
      xStart = 1.2 * this.squareWidth + xGem1;
      yStart = -0.5 * this.squareHeight + yGem1;
      this.context.beginPath();
      this.context.moveTo(xStart, yStart);
      this.context.lineTo(xStart - quad, yStart - quad);
      this.context.lineTo(xStart - quad, yStart + quad);
      this.context.fill();
      this.context.rect(-2 * quad + xStart, -0.5 * quad + yStart, quad, quad);
      this.context.fill();
      this.context.closePath();
    } else if (moveDir === "left") {
      xStart = -0.25 * this.squareWidth + xGem1;
      yStart = -0.5 * this.squareHeight + yGem1;
      this.context.beginPath();
      this.context.moveTo(xStart, yStart);
      this.context.lineTo(xStart + quad, yStart + quad);
      this.context.lineTo(xStart + quad, yStart - quad);
      this.context.fill();
      this.context.rect(quad + xStart, -0.5 * quad + yStart, quad, quad);
      this.context.fill();
      this.context.closePath();
    } else if (moveDir === "down") {
      xStart = 0.5 * this.squareWidth + xGem1;
      yStart = 0.25 * this.squareHeight + yGem1;
      this.context.beginPath();
      this.context.moveTo(xStart, yStart);
      this.context.lineTo(xStart + quad, yStart - quad);
      this.context.lineTo(xStart - quad, yStart - quad);
      this.context.fill();
      this.context.rect(-0.5 * quad + xStart, -2 * quad + yStart, quad, quad);
      this.context.fill();
      this.context.closePath();
    } else if (moveDir === "up") {
      xStart = 0.5 * this.squareWidth + xGem1;
      yStart = -1.2 * this.squareHeight + yGem1;
      this.context.beginPath();
      this.context.moveTo(xStart, yStart);
      this.context.lineTo(xStart - quad, yStart + quad);
      this.context.lineTo(xStart + quad, yStart + quad);
      this.context.fill();
      this.context.rect(-0.5 * quad + xStart, quad + yStart, quad, quad);
      this.context.fill();
      this.context.closePath();
    }

    this.context.restore();
  }

  // used by the "I'm Lazy" button
  makeRandomMove() {
    const i = Math.floor(this.matchingMoves.length * Math.random());
    const move = this.matchingMoves[i];
    const { gem1, gem2 } = move;
    setTimeout(() => {
      this.swap(gem1, gem2);
      this.matchesExist = true;
      this.removeMatchesUntilStable();
    }, 300);
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

  ////////////////////////////////////////////////
  // CANVAS

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
    const width = this.squareWidth;
    const height = this.squareHeight;

    const gem1Dir = gem1Movement === "right" ? 1 : -1;
    const gem1Theme = this.theme[gem1.value];
    const gem1Image = document.getElementById(gem1Theme);
    const gem1LeftInitial = gem1.col() * width;
    const gem1Top = gem1.row() * height;

    const gem2Dir = gem1Movement === "right" ? -1 : 1;
    const gem2Theme = this.theme[gem2.value];
    const gem2Image = document.getElementById(gem2Theme);
    const gem2LeftInitial = gem2.col() * width;
    const gem2Top = gem2.row() * height;

    // swap animation
    let timer = 0;
    const hSwap = setInterval(() => {
      this.clearHorizontal(gem1, gem2, gem1Movement);

      const leftOffset = (++timer * width) / 20;
      const gem1Left = gem1LeftInitial + leftOffset * gem1Dir;
      const gem2Left = gem2LeftInitial + leftOffset * gem2Dir;

      this.context.drawImage(gem1Image, gem1Left, gem1Top, width, height);
      this.context.drawImage(gem2Image, gem2Left, gem2Top, width, height);

      if (timer >= 20) {
        clearInterval(hSwap);
        this.gameboard.swapGems(gem1, gem2);
        $("#mainColumn").html(this.drawGameboard());
      }
    }, 10);
  }

  verticalSwap(gem1, gem2, gem1Movement) {
    const width = this.squareWidth;
    const height = this.squareHeight;

    const gem1Dir = gem1Movement === "down" ? 1 : -1;
    const gem1Theme = this.theme[gem1.value];
    const gem1Image = document.getElementById(gem1Theme);
    const gem1Left = gem1.col() * width;
    const gem1TopInitial = gem1.row() * this.squareHeight;

    const gem2Dir = gem1Movement === "down" ? -1 : 1;
    const gem2Theme = this.theme[gem2.value];
    const gem2Image = document.getElementById(gem2Theme);
    const gem2Left = gem2.col() * width;
    const gem2TopInitial = gem2.row() * this.squareHeight;

    // swap animation
    let timer = 0;
    const vSwap = setInterval(() => {
      this.clearVertical(gem1, gem2, gem1Movement);

      const topOffset = (++timer * height) / 20;
      const gem1Top = gem1TopInitial + topOffset * gem1Dir;
      const gem2Top = gem2TopInitial + topOffset * gem2Dir;

      this.context.drawImage(gem1Image, gem1Left, gem1Top, width, height);
      this.context.drawImage(gem2Image, gem2Left, gem2Top, width, height);

      if (timer >= 20) {
        clearInterval(vSwap);
        this.gameboard.swapGems(gem1, gem2);
        $("#mainColumn").html(this.drawGameboard());
      }
    }, 10);
  }

  shake() {
    $(gameCanvas).addClass("shake");
    console.log("shake");
    setTimeout(() => $(gameCanvas).removeClass("shake"), 300);
  }

  shuffle() {
    this.gameboard.randomize();
    $("#mainColumn").html(this.drawGameboard());
    this.checkForMoves();
  }
}
