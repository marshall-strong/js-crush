const Board = function (size) {
  ////////////////////////////////////////////////
  // Gameboard

  Object.defineProperty(this, "size", {
    enumberable: false,
    configurable: false,
    writable: false,
    value: size,
  });

  this.newGrid = function () {
    let matrix = new Array(this.size);
    for (let i = 0; i < this.size; i++) {
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
  // functions with `row` and `col` parameters return info about a cell

  this.isValidCell = function (row, col) {
    const validValues = [...Array(this.size).keys()];
    return validValues.includes(row) && validValues.includes(col);
  };

  this.isEmptyCell = function (row, col) {
    return this.gemAt(row, col) ? false : true;
  };

  this.gemAt = function (row, col) {
    return this.isValidCell(row, col) ? this.grid[row][col] : null;
  };

  ////////////////////////////////////////////////
  // CREATE GEMS

  Object.defineProperty(this, "nextGemId", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: 0,
  });

  this.createRandomGem = function () {
    const index = Math.floor(Math.random() * Gem.letters.length);
    const letter = Gem.letters[index];
    const newGem = new Gem(letter, this.nextGemId++);
    return newGem;
  };

  // Add a new gem to the board.
  // spawnRow, spawnCol are optional args.
  // They indicate where the gem was "spawned", BEFORE it moved to row, col.
  // The spawn location may be off the board.
  // Spawn Location is included to the 'add' event.
  // It is used to animate new gems that are coming in from offscreen.

  this.addRandomGem = function (row, col, spawnRow, spawnCol) {
    if (this.isEmptyCell(row, col)) {
      const newGem = this.createRandomGem();
      const details = {
        gem: newGem,
        toRow: row,
        toCol: col,
        fromRow: spawnRow,
        fromCol: spawnCol,
      };
      newGem.row = row;
      newGem.col = col;
      this.grid[row][col] = newGem;
      $(this).triggerHandler("add", details);
    } else {
      console.log("add already found a gem at " + row + "," + col);
    }
  };

  ////////////////////////////////////////////////
  // MOVE GEMS

  // Flip gem1 with gem2 in one step, firing two move events.
  // Does not verify the validity of the flip.
  // Does not crush gems produced by flip.
  this.flipGems = function (gem1, gem2) {
    // Swap the two gems simultaneously.
    const details1 = {
      gem: gem1,
      toRow: gem2.row,
      toCol: gem2.col,
      fromRow: gem1.row,
      fromCol: gem1.col,
    };
    const details2 = {
      gem: gem2,
      toRow: gem1.row,
      toCol: gem1.col,
      fromRow: gem2.row,
      fromCol: gem2.col,
    };

    gem1.row = details1.toRow;
    gem1.col = details1.toCol;
    this.grid[details1.toRow][details1.toCol] = gem1;
    gem2.row = details2.toRow;
    gem2.col = details2.toCol;
    this.grid[details2.toRow][details2.toCol] = gem2;

    // Trigger two move events.
    $(this).triggerHandler("move", details1);
    $(this).triggerHandler("move", details2);
  };

  this.doAutoMove = function () {
    const move = game.getRandomValidMove();
    const toGem = board.getGemInDirection(move.gem, move.direction);
    this.flipGems(move.gem, toGem);
  };

  // move gem from current squre to another square
  this.moveTo = function (gem, toRow, toCol) {
    if (this.isEmptyCell(toRow, toCol)) {
      const details = {
        gem: gem,
        toRow: toRow,
        toCol: toCol,
        fromRow: gem.row,
        fromCol: gem.col,
      };

      delete this.grid[gem.row][gem.col];
      this.grid[toRow][toCol] = gem;

      gem.row = toRow;
      gem.col = toCol;

      $(this).triggerHandler("move", details);
    }
  };

  ////////////////////////////////////////////////
  // REMOVE GEMS

  // remove specified gem from the board
  this.remove = function (gem) {
    const details = {
      gem: gem,
      fromRow: gem.row,
      fromCol: gem.col,
    };
    delete this.grid[gem.row][gem.col];
    gem.row = gem.col = null;
    $(this).triggerHandler("remove", details);
  };

  // remove gem at specified position from the board
  this.removeAt = function (row, col) {
    if (this.isEmptyCell(row, col)) {
      console.log("removeAt found no gem at " + r + "," + c);
    } else {
      this.remove(this.grid[row][col]);
    }
  };

  // Remove all gems from the board
  this.clear = function () {
    for (let r in this.grid) {
      for (let c in this.grid[r]) {
        if (this.grid[r][c]) {
          this.removeAt(r, c);
        }
      }
    }
  };

  ////////////////////////////////////////////////
  // Get Gem in Direction
  //

  // Returns the gem immediately in the direction specified by direction
  // ['up', 'down', 'left', 'right'] from the gem passed as fromGem
  this.getGemInDirection = function (fromGem, direction) {
    switch (direction) {
      case "up": {
        return this.gemAt(fromGem.row - 1, fromGem.col);
      }
      case "down": {
        return this.gemAt(fromGem.row + 1, fromGem.col);
      }
      case "left": {
        return this.gemAt(fromGem.row, fromGem.col - 1);
      }
      case "right": {
        return this.gemAt(fromGem.row, fromGem.col + 1);
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

  this.incrementScore = function (gem, row, col) {
    this.score += 1;
    $(this).triggerHandler("scoreUpdate", [
      {
        score: this.score,
        gem: gem,
        row: row,
        col: col,
      },
    ]);
  };
};
