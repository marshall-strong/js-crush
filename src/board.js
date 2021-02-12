const Board = function (dimension) {
  ////////////////////////////////////////////////
  // setup grid

  Object.defineProperty(this, "dimension", {
    enumberable: false,
    configurable: false,
    writable: false,
    value: dimension,
  });

  this.newGrid = function () {
    let matrix = new Array(this.dimension);
    for (let i = 0; i < this.dimension; i++) {
      matrix[i] = [];
    }
    return matrix;
  };

  Object.defineProperty(this, "grid", {
    enumberable: false,
    configurable: true,
    writable: true,
    value: this.newGrid(),
  });

  ////////////////////////////////////////////////
  // square info

  this.squareExists = function (col, row) {
    const indexes = [...Array(this.dimension).keys()];
    const colExists = indexes.includes(col);
    const rowExists = indexes.includes(row);
    return colExists && rowExists;
  };

  this.gemAtSquare = function (col, row) {
    return this.squareExists(col, row) ? this.grid[row][col] : null;
  };

  this.squareIsEmpty = function (col, row) {
    return this.gemAtSquare(col, row) ? false : true;
  };

  this.adjacentSquares = function (col, row) {
    const above = { col: col, row: row - 1 };
    const below = { col: col, row: row + 1 };
    const left = { col: col - 1, row: row };
    const right = { col: col + 1, row: row };
    const adjacent = [];
    if (this.squareExists(above.col, above.row)) adjacent.push(above);
    if (this.squareExists(below.col, below.row)) adjacent.push(below);
    if (this.squareExists(left.col, left.row)) adjacent.push(left);
    if (this.squareExists(right.col, right.row)) adjacent.push(right);
    return adjacent;
  };

  this.adjacentGems = function (col, row) {
    const squares = this.adjacentSquares(col, row);
    const gems = squares.map((sqr) => this.gemAtSquare(sqr.col, sqr.row));
    return gems;
  };

  ////////////////////////////////////////////////
  // CREATE GEMS

  Object.defineProperty(this, "nextGemId", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: 0,
  });

  this.createGem = function () {
    const index = Math.floor(Math.random() * Gem.letters.length);
    const letter = Gem.letters[index];
    const newGem = new Gem(letter, this.nextGemId++);
    return newGem;
  };

  this.addGemToBoard = function (col, row, spawnCol = col, spawnRow = row) {
    if (this.squareIsEmpty(col, row)) {
      const newGem = this.createGem();
      newGem.col = col;
      newGem.row = row;
      this.grid[row][col] = newGem;
      const details = {
        gem: newGem,
        toCol: col,
        toRow: row,
        fromCol: spawnCol,
        fromRow: spawnRow,
      };
      $(this).triggerHandler("add", details);
    } else {
      // console.log("add already found a gem at " + row + "," + col);
    }
  };

  ////////////////////////////////////////////////
  // MOVE GEMS

  // Flip gem1 with gem2 in one step, firing two move events.
  // Does not verify the validity of the flip.
  // Does not crush gems produced by flip.
  this.swapGems = function (gem1, gem2) {
    // Swap the two gems simultaneously.
    const details1 = {
      gem: gem1,
      toCol: gem2.col,
      toRow: gem2.row,
      fromCol: gem1.col,
      fromRow: gem1.row,
    };
    const details2 = {
      gem: gem2,
      toCol: gem1.col,
      toRow: gem1.row,
      fromCol: gem2.col,
      fromRow: gem2.row,
    };

    gem1.col = details1.toCol;
    gem1.row = details1.toRow;
    this.grid[details1.toRow][details1.toCol] = gem1;
    gem2.col = details2.toCol;
    gem2.row = details2.toRow;
    this.grid[details2.toRow][details2.toCol] = gem2;

    // Trigger two move events.
    $(this).triggerHandler("move", details1);
    $(this).triggerHandler("move", details2);
  };

  this.doAutoMove = function () {
    const move = game.getRandomValidMove();
    const toGem = board.getGemInDirection(move.gem, move.direction);
    this.swapGems(move.gem, toGem);
  };

  // move gem from current squre to another square
  this.moveTo = function (gem, toCol, toRow) {
    if (this.squareIsEmpty(toCol, toRow)) {
      delete this.grid[gem.row][gem.col];
      this.grid[toRow][toCol] = gem;
      gem.col = toCol;
      gem.row = toRow;

      const details = {
        gem: gem,
        toCol: toCol,
        toRow: toRow,
        fromCol: gem.col,
        fromRow: gem.row,
      };

      $(this).triggerHandler("move", details);
    }
  };

  ////////////////////////////////////////////////
  // REMOVE GEMS

  // remove specified gem from the board
  this.remove = function (gem) {
    const details = {
      gem: gem,
      fromCol: gem.col,
      fromRow: gem.row,
    };
    delete this.grid[gem.row][gem.col];
    gem.col = null;
    gem.row = null;
    $(this).triggerHandler("remove", details);
  };

  // remove gem at specified position from the board
  this.removeAt = function (col, row) {
    if (this.squareIsEmpty(col, row)) {
      console.log(`!! removeAt found no gem at col ${col}, row ${row}.`);
    } else {
      this.remove(this.grid[row][col]);
    }
  };

  ////////////////////////////////////////////////
  // Returns the gem immediately in the direction specified by direction
  // ['up', 'down', 'left', 'right'] from the gem passed as fromGem
  this.getGemInDirection = function (fromGem, direction) {
    switch (direction) {
      case "up": {
        return this.gemAtSquare(fromGem.col, fromGem.row - 1);
      }
      case "down": {
        return this.gemAtSquare(fromGem.col, fromGem.row + 1);
      }
      case "left": {
        return this.gemAtSquare(fromGem.col - 1, fromGem.row);
      }
      case "right": {
        return this.gemAtSquare(fromGem.col + 1, fromGem.row);
      }
    }
  };

  ////////////////////////////////////////////////
  // SCORE

  Object.defineProperty(this, "score", {
    enumberable: false,
    configurable: true,
    writable: true,
    value: 0,
  });

  this.resetScore = function () {
    this.score = 0;
    $(this).triggerHandler("scoreUpdate", [{ score: 0 }]);
  };

  this.incrementScore = function (gem, col, row) {
    this.score += 1;
    $(this).triggerHandler("scoreUpdate", [
      {
        score: this.score,
        gem: gem,
        col: col,
        row: row,
      },
    ]);
  };

  this.updateScoreColor = function (gem) {
    let color;
    if (gem.letter === "github") color = "#424242";
    if (gem.letter === "react") color = "#529F41";
    if (gem.letter === "javascript") color = "#F7DF1E";
    if (gem.letter === "nodejs") color = "#529E41";
    if (gem.letter === "webpack") color = "#8FD6FA";
    if (gem.letter === "jquery") color = "#193556";
    document.getElementById("score").style.backgroundColor = color;
  };
};
