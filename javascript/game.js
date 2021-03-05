class Game {
  constructor(gameCanvas) {
    this.autoPlay = false;
    this.status = "resetting";
    this.matchingMoves = [];
    this.matchesExist = false;
    this.mousedownGem = null;
    this.mouseupGem = null;
    this.firstGem = null;
    this.pointsEarned = 0;
    this.totalPoints = 0;
    this.totalGemsRemoved = 0;
    this.lastGemValue = null;

    this.canvas = gameCanvas;
    this.context = this.canvas.getContext("2d");
    this.gridSize = 8;
    this.gameboard = new Board(this.gridSize);
    this.layout = null; // "landscape" || "portrait"
    this.setTheme(themes.web);
    this.drawGameboard();
  }

  setTheme(theme) {
    this.theme = theme;
    const body = document.getElementById("application");
    if (this.theme.name === "farm") {
      body.classList.add("farmBG");
      body.classList.remove("candyBG", "webBG", "foodBG", "oceanBG");
    } else if (this.theme.name === "candy") {
      body.classList.add("candyBG");
      body.classList.remove("farmBG", "webBG", "foodBG", "oceanBG");
    } else if (this.theme.name === "web") {
      body.classList.add("webBG");
      body.classList.remove("farmBG", "candyBG", "foodBG", "oceanBG");
    } else if (this.theme.name === "food") {
      body.classList.add("foodBG");
      body.classList.remove("farmBG", "candyBG", "webBG", "oceanBG");
    } else if (this.theme.name === "ocean") {
      body.classList.add("oceanBG");
      body.classList.remove("farmBG", "candyBG", "webBG", "foodBG");
    }
    this.drawGameboard();
  }

  drawGameboard() {
    // SET LAYOUT
    const main = document.getElementById("main");
    main.classList.remove("landscape", "portrait");

    if (window.innerWidth > window.innerHeight) {
      this.layout = "landscape";
      main.classList.add("landscape");
    } else {
      this.layout = "portrait";
      main.classList.add("portrait");
    }

    if (window.innerWidth > window.innerHeight) {
      this.canvas.width = 0.7 * window.innerHeight;
    } else {
      this.canvas.width = 0.7 * window.innerWidth;
    }

    // if (window.innerWidth > 600) {
    //   this.canvas.width = 600;
    // } else {
    //   this.canvas.width = 0.9 * window.innerWidth;
    // }
    this.canvas.height = this.canvas.width;
    this.squareWidth = this.canvas.width / this.gridSize;
    this.squareHeight = this.canvas.height / this.gridSize;

    // DRAW GAMEBOARD
    this.context.clearRect(0, 0, this.context.width, this.context.height);
    this.context.strokeStyle = "white";
    this.context.lineWidth = 2;
    // iterate through grid squares
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        // draw square outline
        this.context.strokeRect(
          col * this.squareWidth,
          row * this.squareHeight,
          this.squareWidth,
          this.squareHeight
        );
        // draw gem, if it exists
        const x = col * this.squareWidth + 0.1 * this.squareWidth;
        const y = row * this.squareHeight + 0.1 * this.squareHeight;
        const width = 0.8 * this.squareWidth;
        const height = 0.8 * this.squareHeight;
        const gem = this.gameboard.gem(col, row);
        if (gem) {
          const themeValue = this.theme[gem.value];
          const image = document.getElementById(themeValue);
          this.context.drawImage(image, x, y, width, height);
        }
      }
    }
  }

  // Called at setup, and when "New Game" is clicked.
  resetGame() {
    this.setStatus("resetting");
    this.gameboard = new Board(this.gridSize);
    this.drawGameboard();
    let emptySquares = true;
    while (emptySquares) {
      for (let row = 0; row < this.gridSize; row++) {
        for (let col = 0; col < this.gridSize; col++) {
          if (!this.gameboard.gem(col, row)) this.gameboard.addNewGem(col, row);
        }
      }
      this.drawGameboard();
      const matches = this.gameboard.getMatches();
      if (matches.length > 0) {
        const gems = [].concat.apply([], matches);
        this.gameboard.removeGems(gems);
      } else {
        emptySquares = false;
      }
    }

    this.clearScore();
    this.drawGameboard();
    this.ensureMatchingMovesExist();
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
  // triggers `highlightGem(gem)` and `checkMove(mousedownGem, mouseupGem).
  checkMouseEvent() {
    // only checks mouse events if there are gems on the board
    if (this.mousedownGem && this.mouseupGem) {
      if (this.mousedownGem === this.mouseupGem) {
        // handles clicks
        if (!this.firstGem) {
          this.firstGem = this.mousedownGem;
          this.highlightGem(this.firstGem);
        } else {
          const firstGem = this.firstGem;
          this.firstGem = null;
          const secondGem = this.mousedownGem;
          this.highlightGem(secondGem);
          this.checkMove(firstGem, secondGem);
        }
      } else {
        // handles drags
        this.firstGem = null;
        this.checkMove(this.mousedownGem, this.mouseupGem);
      }
    }
  }

  //
  //
  setStatus(status) {
    if (status === "running") {
      this.status = "running";
      document.getElementById("newGame").disabled = true;
      document.getElementById("autoMove").disabled = true;
      document.getElementById("farm").disabled = true;
      document.getElementById("candy").disabled = true;
      document.getElementById("web").disabled = true;
      document.getElementById("food").disabled = true;
      document.getElementById("ocean").disabled = true;
    }
    if (status === "ready") {
      this.status = "ready";
      document.getElementById("newGame").disabled = false;
      document.getElementById("autoMove").disabled = false;
      document.getElementById("farm").disabled = false;
      document.getElementById("candy").disabled = false;
      document.getElementById("web").disabled = false;
      document.getElementById("food").disabled = false;
      document.getElementById("ocean").disabled = false;
    }
  }

  //
  //
  // Returns a copy of `this.gameboard`, used when finding matches
  gameboardCopy() {
    const newBoard = new Board(this.gridSize);
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const gem = this.gameboard.gem(col, row);
        newBoard.updateGem(gem, col, row);
      }
    }
    return newBoard;
  }

  // Swaps `gem1` and `gem2` in a copy of `this.gameboard`, then calls `getMatches` on the copy.
  findMatchesMade(gem1, gem2) {
    const newBoard = this.gameboardCopy();
    newBoard.swapGems(gem1, gem2);
    return newBoard.getMatches();
  }

  // Triggered by checkMouseEvent,
  // triggers the appropriate animations.
  checkMove(gem1, gem2) {
    this.setStatus("running");
    const gem1Adjacent = this.gameboard.adjacentGems(gem1);
    if (!(gem1Adjacent.indexOf(gem2) >= 0)) {
      // handles non-adjacent moves
      setTimeout(() => {
        this.shakeGameboard(gem1, gem2);
        this.drawGameboard();
        this.setStatus("ready");
      }, 550);
    } else {
      const matchesMade = this.findMatchesMade(gem1, gem2);
      if (matchesMade.length > 0) {
        // handles adjacent, matching moves
        setTimeout(() => {
          this.swapGems(gem1, gem2);
          this.matchesExist = true;
          this.removeMatchesTilBoardIsStable();
        }, 300);
      } else {
        // handles adjacent, non-matching moves
        setTimeout(() => {
          this.swapGems(gem1, gem2);
          setTimeout(() => {
            this.shakeGameboard(gem1, gem2);
            this.swapGems(gem2, gem1);
            this.setStatus("ready");
          }, 550);
        }, 300);
      }
    }
  }

  //
  //
  // Removes gems in `matches` from `this.gameboard` and updates score.
  // Does not replace removed gems or move remaining gems down.
  removeMatches(matches) {
    const gems = [].concat.apply([], matches);
    this.gameboard.removeGems(gems);
    this.drawGameboard();
    this.shiftGemsDown();
  }

  shiftGemsDown() {
    // helper function -- shifts all gems above (gemCol, gemRow) down one row.
    const shiftColDown = (gemCol, gemRow) => {
      const col = gemCol;
      for (let row = gemRow; row > 0; row--) {
        const gem = this.gameboard.gem(col, row - 1);
        this.gameboard.updateGem(gem, col, row);
      }
    };

    // Iterates through gameboard rows, starting with the top row
    // If a gap is found, all gems above it are shifted downward,
    // a new gem is added to the top row, and the game pauses before redrawing,
    // making the gems appear to fall downward.
    for (let row = 0; row < this.gridSize; row++) {
      let gapFound = false;
      for (let col = 0; col < this.gridSize; col++) {
        if (this.gameboard.gem(col, row)) {
          continue;
        } else {
          shiftColDown(col, row);
          this.gameboard.addNewGem(col, 0);
          gapFound = true;
        }
      }
      const delay = gapFound ? 500 : null;
      setTimeout(() => this.drawGameboard(), delay);
    }
    this.checkBoardForMatches();
  }

  checkBoardForMatches() {
    const matches = this.gameboard.getMatches();
    if (matches.length > 0) {
      this.matchesExist = true;
    } else {
      this.matchesExist = false;
      this.ensureMatchingMovesExist();
    }
  }

  // Continually checks for matches until the gameboard reaches a stable state.
  removeMatchesTilBoardIsStable() {
    const keepChecking = setInterval(() => {
      if (this.matchesExist) {
        const matches = this.gameboard.getMatches();
        // cascades all the other actions as well
        this.fadeOutMatches(matches);
        // culminates with `checkBoardForMatches()`, which sets `this.matchesExist`
      } else {
        clearInterval(keepChecking);
      }
    }, 1000);
  }

  // Iterates through every gameboard square and checks each direction.
  // Returns an array of all matching moves that can be made.
  // Each move is represented as an object: move = { gem1, gem2 }
  getMatchingMoves() {
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

  // Gets called at the very end of the game logic cycle.
  // Triggers `game.shuffleGameboard()` if no more matches can be made.
  ensureMatchingMovesExist() {
    const matchingMoves = this.getMatchingMoves();
    if (matchingMoves.length > 0) {
      this.matchingMoves = matchingMoves;
      this.endLogicCycle();
    } else {
      this.matchingMoves = [];
      console.log("no remaining moves -- shuffling!");
      this.shuffleGameboard();
    }
  }

  shuffleGameboard() {
    this.gameboard.randomize();
    this.drawGameboard();
    this.ensureMatchingMovesExist();
  }

  endLogicCycle() {
    this.setStatus("ready");

    if (this.autoPlay) {
      console.log("autoPlay will make next move");
      this.makeRandomMove();
    } else {
      console.log("ready for next move");
    }
  }

  //
  //
  updateScore(matches) {
    const multiplier = matches.length;
    const gems = [].concat.apply([], matches);
    this.pointsEarned = gems.length * multiplier * 40;
    this.totalPoints = this.totalPoints + this.pointsEarned;
    this.totalGemsRemoved = this.totalGemsRemoved + gems.length;
    this.lastGemValue = gems[0].value;
    document.dispatchEvent(new Event("updateScore"));
  }

  clearScore() {
    this.pointsEarned = 0;
    this.totalPoints = 0;
    this.totalGemsRemoved = 0;
    this.lastGemValue = null;
    document.dispatchEvent(new Event("updateScore"));
  }

  //
  // used by the "Get Hint" button
  showRandomMove() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGameboard();

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

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGameboard();

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
    this.setStatus("running");
    const i = Math.floor(this.matchingMoves.length * Math.random());
    const move = this.matchingMoves[i];
    const { gem1, gem2 } = move;
    setTimeout(() => {
      this.swapGems(gem1, gem2);
      this.matchesExist = true;
      this.removeMatchesTilBoardIsStable();
    }, 300);
  }

  toggleAutoPlay() {
    if (!this.autoPlay) {
      console.log("autoPlay = true");
      this.autoPlay = true;
      this.makeRandomMove();
    } else {
      console.log("autoPlay = false");
      this.autoPlay = false;
    }
  }

  //
  //

  shakeGameboard() {
    document.getElementById("gameCanvas").classList.add("shake");
    console.log("shake");
    setTimeout(
      () => document.getElementById("gameCanvas").classList.remove("shake"),
      300
    );
  }

  highlightGem(gem) {
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

  swapGems(gem1, gem2) {
    const gem1Movement = this.gameboard.relativePosition(gem1, gem2);
    if (gem1Movement === "right" || gem1Movement === "left") {
      this.hSwapGems(gem1, gem2, gem1Movement);
    } else if (gem1Movement === "down" || gem1Movement === "up") {
      this.vSwapGems(gem1, gem2, gem1Movement);
    }
  }

  hSwapGems(gem1, gem2, gem1Movement) {
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

    const clearHorizontal = (gem1, gem2, gem1Movement) => {
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
    };

    // swap animation
    let timer = 0;
    const hSwap = setInterval(() => {
      clearHorizontal(gem1, gem2, gem1Movement);

      const leftOffset = (++timer * width) / 20;
      const gem1Left = gem1LeftInitial + leftOffset * gem1Dir;
      const gem2Left = gem2LeftInitial + leftOffset * gem2Dir;

      this.context.drawImage(gem1Image, gem1Left, gem1Top, width, height);
      this.context.drawImage(gem2Image, gem2Left, gem2Top, width, height);

      if (timer >= 20) {
        clearInterval(hSwap);
        this.gameboard.swapGems(gem1, gem2);
        this.drawGameboard();
      }
    }, 10);
  }

  vSwapGems(gem1, gem2, gem1Movement) {
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

    const clearVertical = (gem1, gem2, gem1Movement) => {
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
    };

    // swap animation
    let timer = 0;
    const vSwap = setInterval(() => {
      clearVertical(gem1, gem2, gem1Movement);

      const topOffset = (++timer * height) / 20;
      const gem1Top = gem1TopInitial + topOffset * gem1Dir;
      const gem2Top = gem2TopInitial + topOffset * gem2Dir;

      this.context.drawImage(gem1Image, gem1Left, gem1Top, width, height);
      this.context.drawImage(gem2Image, gem2Left, gem2Top, width, height);

      if (timer >= 20) {
        clearInterval(vSwap);
        this.gameboard.swapGems(gem1, gem2);
        this.drawGameboard();
      }
    }, 10);
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
}
