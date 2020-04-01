const Board = function(size) {
  // each gem gets a unique ID
  let gemCounter = 0;

  // game score, one point per gem
  this.score = 0;

  // boardSize is number of squares on one side of gem-board
  this.boardSize = size;

  // square is a two dimensional array representating the gemboard
  // square[row][col] is the gem in that square, or null if square is empty
  this.square = new Array(this.boardSize);
  // make an empty gemboard
  for (let i = 0; i <= this.boardSize; i++)
  {
    this.square[i] = [];
  }

  /*
   * Returns true/false depending on whether row and column
   * identify a valid square on the board.
   */
  this.isValidLocation = function(row, col)
  {
    return (row >= 0 && col >= 0 &&
            row <= this.boardSize && col <= this.boardSize &&
            row == Math.round(row) && col == Math.round(col));
  }

  /*
   * Returns true/false depending on whether the
   * square at [row,col] is empty (does not contain a gem).
   */
  this.isEmptyLocation = function(row, col)
  {
    if (this.getGemAt(row, col)) {
      return false;
    }
    return true;
  }

  ////////////////////////////////////////////////
  // Public methods
  //

  /* 
  * Perform an a valid move automatically on the board. Flips the 
  * appropriate candies, but does not crush the candies. 
  */
  this.doAutoMove = function() {
    var move = rules.getRandomValidMove();
    var toGem = board.getGemInDirection(move.gem, move.direction);
    this.flipCandies(move.gem,toGem);
  }


  /*
   * Returns the number of squares on each side of the board
   */
  this.getSize = function()
  {
    return this.boardSize;
  }

  /**
   * Get the gem found on the square at [row,column], or null
   * if the square is empty.  Requires row,column < size.
   */
  this.getGemAt = function(row, col)
  {
    if (this.isValidLocation(row,col))
    {
      return this.square[row][col];
    }
  }

  /**
   * Get location of gem (row and column) if it's found on this
   * board, or null if not found.
   */
  this.getLocationOf  = function(gem){
    return {row:gem.row, col:gem.col};
  }

  /**
   * Get a list of all candies on the board, in no particular order.
   */
  this.getAllCandies = function(){
    var results = [];
    for (var r in this.square) {
      for (var c in this.square[r]) {
        if (this.square[r][c]) {
         results.push(this.square[r][c]);
        }
      }
    }
    return results;
  }



  /*
  * Add a new gem to the board.  Requires candies to be not currently
  * on the board, and (row,col) must designate a valid empty square.
  *
  * The optional spawnRow, spawnCol indicate where the gem
  * was "spawned" the moment before it moved to row, col. This location,
  * which may be off the board, is added to the 'add' event and
  * can be used to animate new candies that are coming in from offscreen.
  */
  this.add = function(gem, row, col, spawnRow, spawnCol)
  {
    if (this.isEmptyLocation(row, col))
    {
      var details = {
        gem: gem,
        toRow: row,
        toCol: col,
        fromRow: spawnRow,
        fromCol: spawnCol
      };

      gem.row = row;
      gem.col = col;

      this.square[row][col] = gem;

      $(this).triggerHandler("add", details);
    }
    else
    {
      console.log("add already found a gem at " + row + "," + col);
    }
  }

  /**
  * Move a gem from its current square to another square.
  * Requires gem to be already found on this board, and (toRow,toCol)
  * must denote a valid empty square.
  */
  this.moveTo = function(gem, toRow, toCol)
  {
    if (this.isEmptyLocation(toRow,toCol))
    {
      var details = {
        gem:gem,
        toRow:toRow,
        toCol:toCol,
        fromRow:gem.row,
        fromCol:gem.col};

      delete this.square[gem.row][gem.col];
      this.square[toRow][toCol] = gem;

      gem.row = toRow;
      gem.col = toCol;

      $(this).triggerHandler("move", details);
    }
  }

  /**
  * Remove a gem from this board.
  * Requires gem to be found on this board.
  */
  this.remove = function(gem)
  {
    var details = {
      gem: gem,
      fromRow: gem.row,
      fromCol: gem.col
    };
    delete this.square[gem.row][gem.col];
    gem.row = gem.col = null;
    $(this).triggerHandler("remove", details);
    // console.log(details);
  }

  /**
  * Remove a gem at a given location from this board.
  * Requires gem to be found on this board.
  */
  this.removeAt = function(row, col)
  {
    if (this.isEmptyLocation(row, col))
    {
      console.log("removeAt found no gem at " + r + "," + c);
    }
    else
    {
      this.remove(this.square[row][col]);
    }
  }


  /**
  * Remove all candies from board.
  */
  this.clear = function() {
    for (var r in this.square)
    {
      for (var c in this.square[r])
      {
        if (this.square[r][c])
        {
          this.removeAt(r, c);
        }
      }
    }
  }


  ////////////////////////////////////////////////
  // Utilities
  //

  /*
  Adds a gem of specified color to row, col. 
  */
  this.addGem = function(color, row, col, spawnRow, spawnCol)
  {
    var gem = new Gem(color, gemCounter++);
    this.add(gem, row, col, spawnRow, spawnCol);
  }

  /**
  * Adds a gem of random color at row, col.
  */
  this.addRandomGem = function(row, col, spawnRow, spawnCol)
  {
    var random_color = Math.floor(Math.random() * Gem.colors.length);
    var gem = new Gem(Gem.colors[random_color], gemCounter++);
    this.add(gem, row, col, spawnRow, spawnCol);
  }

  /*
  Returns the gem immediately in the direction specified by direction
  ['up', 'down', 'left', 'right'] from the gem passed as fromGem
  */
  this.getGemInDirection = function(fromGem, direction)
  {
    switch(direction)
    {
      case "up":  {
        return this.getGemAt(fromGem.row-1, fromGem.col);
      }
      case "down": {
        return this.getGemAt(fromGem.row+1, fromGem.col);
      }
      case "left": {
        return this.getGemAt(fromGem.row, fromGem.col-1);
      }
      case "right": {
        return this.getGemAt(fromGem.row, fromGem.col+1);
      }
    }
  }


  /* Flip gem1 with gem2 in one step, firing two move events.
   * Does not verify the validity of the flip. Does not crush candies
   * produced by flip. */
  this.flipCandies = function(gem1, gem2)
  {
    // Swap the two gems simultaneously.
    var details1 = {
      gem: gem1,
      toRow: gem2.row,
      toCol: gem2.col,
      fromRow: gem1.row,
      fromCol: gem1.col
    };
    var details2 = {
      gem: gem2,
      toRow: gem1.row,
      toCol: gem1.col,
      fromRow: gem2.row,
      fromCol: gem2.col
    };
    gem1.row = details1.toRow;
    gem1.col = details1.toCol;
    this.square[details1.toRow][details1.toCol] = gem1;
    gem2.row = details2.toRow;
    gem2.col = details2.toCol;
    this.square[details2.toRow][details2.toCol] = gem2;

    // Trigger two move events.
    $(this).triggerHandler("move", details1);
    $(this).triggerHandler("move", details2);
  }

  // reset score
  this.resetScore = function() {
    this.score = 0;
    $(this).triggerHandler("scoreUpdate", [{score: 0}]);
  }

  // update score
  this.incrementScore = function(gem, row, col) {
    this.score += 1;
    // console.log(this.score);

    $(this).triggerHandler("scoreUpdate", [{
      score: this.score,
      gem: gem,
      row: row,
      col: col
    }]);
  }

  // get current score
  this.getScore = function() {
    return this.score
  }


  // get a string representation of the board as a matrix
  this.toString = function()
  {
    let result = "";
    for (let r = 0; r < this.boardSize; ++r) {
      for (let c = 0; c < this.boardSize; ++c) {
        const gem = this.square[r][c];
        if (gem) {
         result += gem.toString().charAt(0) + " ";
        } else {
         result += "_ ";
        }
      }
      result += "<br/>";
    }
    return result.toString();
  }
}
