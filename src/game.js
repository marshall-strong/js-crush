const Game = function (gameboard) {
  ////////////////////////////////////////////////
  // GAME PROPERTIES

  // Object.defineProperty(this, "gameboard", {
  //   enumerable: false,
  //   configurable: true,
  //   writable: true,
  //   value: board,
  // });

  Object.defineProperty(this, "keepScore", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: false,
  });

  ////////////////////////////////////////////////
  // new part

  // used during game setup, newGame button, getHint button, handleDrag
  this.drawBoard = function () {
    const squareLength = 600 / gameboard.dimension;
    const canvas = document.getElementById("gameCanvas");
    ctxt = canvas.getContext("2d");
    // draw grid container
    ctxt.clearRect(0, 0, canvas.width, canvas.height);
    ctxt.strokeStyle = "white";
    // iterate through squares
    for (let row = 0; row < gameboard.dimension; row++) {
      for (let col = 0; col < gameboard.dimension; col++) {
        const dx = col * squareLength;
        const dy = row * squareLength;
        const dWidth = squareLength;
        const dHeight = squareLength;
        // draw square outline
        ctxt.strokeRect(dx, dy, dWidth, dHeight);
        const gem = gameboard.gemAtSquare(row, col);
        const gemImage = document.getElementById(gem.letter);
        // draw gemImage
        ctxt.drawImage(gemImage, dx, dy, dWidth, dHeight);
      }
    }
  };

  // get the gameboard col and row at a mouseEvent
  this.getGameboardColAndRow = function (mouseEvent) {
    const canvas = document.getElementById("gameCanvas");
    const canvasRect = canvas.getBoundingClientRect();
    // mouseEvent coordinates relative to application viewport
    const xViewport = mouseEvent.clientX;
    const yViewport = mouseEvent.clientY;
    // mouseEvent coordinates relative to gameCanvas
    const xCanvas = xViewport - canvasRect.left;
    const yCanvas = yViewport - canvasRect.top;
    // get the indexes of the gameboard col and row at (xCanvas, yCanvas)
    const squareLength = 600 / gameboard.dimension;
    colIndex = Math.floor(xCanvas / squareLength);
    rowIndex = Math.floor(yCanvas / squareLength);
    // log coordinate
    console.log(`${mouseEvent.type} -- col: ${colIndex}, row: ${rowIndex}`);
    // return an object
    return {
      eventType: mouseEvent.type,
      col: colIndex,
      row: rowIndex,
    };
  };

  ////////////////////////////////////////////////
  // GAME SETUP

  this.clearGameboard = function () {
    for (let col = 0; col < gameboard.dimension; col++) {
      for (let row = 0; row < gameboard.dimension; row++) {
        gameboard.removeAt(row, col);
      }
    }
  };

  this.setupGameboard = function () {
    // disable scoring during game setup
    this.keepScore = false;
    // populate gameboard
    while (true) {
      // iterate through gameboard, adding gems to empty squares
      for (let col = 0; col < gameboard.dimension; col++) {
        for (let row = 0; row < gameboard.dimension; row++) {
          if (gameboard.gemAtSquare(row, col) == null)
            gameboard.addGemToBoard(row, col);
        }
      }
      // once all squares are filled, check gameboard for matches
      const crushable = this.getGemStreaks();
      // if no matches are found, exit setup and begin gameplay
      if (crushable.length == 0) break;
      // remove any matches found, then continue the loop to add more gems
      this.removeGemStreaks(crushable);
    }
    // enable scoring
    this.keepScore = true;
  };

  ////////////////////////////////////////////////
  // GAME MOVES

  // Returns true if swapping the `fromGem` with the gem in the specified
  //   direction is a valid move according to the game rules.
  // direction = ['up', 'down', 'left', 'right']
  this.isMoveTypeValid = function (fromGem, direction) {
    return this.numberGemsCrushedByMove(fromGem, direction) > 0;
  };
  // Helper method for game.isMoveTypeValid
  // Returns the number of gems that would be crushed if the gem provided by fromGem were to be flipped in the direction specified(['up', 'down', 'left', 'right'])
  // If move is not valid, return 0
  this.numberGemsCrushedByMove = function (fromGem, direction) {
    return this.getGemsToCrushGivenMove(fromGem, direction).length;
  };
  // Helper method for game.numberGemsCrushedByMove
  // Returns a list of gems that would be "crushed" (i.e. removed) if fromGem were to be moved in the specified direction
  // (['up', 'down', 'left', 'right'])
  // If move would result in no crushed gems, an empty list is returned.
  this.getGemsToCrushGivenMove = function (fromGem, direction) {
    const toGem = gameboard.getGemInDirection(fromGem, direction);

    if (!toGem || toGem.letter == fromGem.letter) {
      return [];
    }
    const swap = [fromGem, toGem];
    const crushable = this.getGemStreaks(swap);
    // Only return crushable groups that involve the swapped gems.
    // If the gameboard has incompletely-resolved crushes, there can be many crushable gems that are not touching the swapped ones.
    const connected = crushable.filter(function (set) {
      for (let k = 0; k < swap.length; k++) {
        if (set.indexOf(swap[k]) >= 0) return true;
      }
      return false;
    });

    return [].concat.apply([], connected); //flatten nested lists
  };

  // If there is a valid move, returns an object with two properties:
  //   gem: a Gem that can be moved
  //   direction: the direction that it can be moved.
  // If there are no valid moves, returns null.
  // The move is selected randomly from the available moves, favoring moves with smaller crushes.
  this.getRandomValidMove = function () {
    const directions = ["up", "down", "left", "right"];
    let validMovesThreeCrush = [];
    let validMovesMoreThanThreeCrush = [];

    // For each square on the gameboard, check to see if moving it in any of the four directions would result in a crush.
    // If yes, add it to the appropriate list (validMoves_threeCrush for crushes where setSize === 3, validMoves_moreThanThreeCrush for crushes where setSize > 3)
    for (let row = 0; row < gameboard.dimension; row++) {
      for (let col = 0; col < gameboard.dimension; col++) {
        const fromGem = gameboard.gemAtSquare(row, col);
        if (!fromGem) continue;
        for (i = 0; i < 4; i++) {
          const direction = directions[i];
          const numGemsCrushed = this.numberGemsCrushedByMove(
            fromGem,
            direction
          );
          if (numGemsCrushed == 3) {
            validMovesThreeCrush.push({ gem: fromGem, direction: direction });
          } else if (numGemsCrushed > 3) {
            validMovesMoreThanThreeCrush.push({
              gem: fromGem,
              direction: direction,
            });
          }
        }
      }
    }
    // if there are three-crushes possible, prioritize these
    const searchArray = validMovesThreeCrush.length
      ? validMovesThreeCrush
      : validMovesMoreThanThreeCrush;
    // If there are no valid moves, return null
    if (searchArray.length == 0) return null;
    // select a random crush from among the crushes found
    return searchArray[Math.floor(Math.random() * searchArray.length)];
  };

  ////////////////////////////////////////////////
  // GAME LOGIC
  // There are 3 steps:
  // #1: getGemStreaks
  // #2: removeGemStreaks
  // #3: moveGemsDown

  // A streak occurs when 3 or more adjacent gems have the same letter.
  // Streaks can be horizontal or vertical, and overlapping streaks are joined.
  // Streaks are provided as arrays, where each element is a gem in the streak.

  // `getGemStreaks` finds and returns all streaks on the gameboard.
  // Results are output as an array of streaks (an array of arrays of gems).

  // `getGemStreaks` accepts an optional parameter `swap` -- an array of two gems.
  // if `swap` is not null, the positions of the two gems in it are swapped when computing streaks.

  // The output of `getGemStreaks` is passed directly to `removeGemStreaks`.
  this.getGemStreaks = function (swap) {
    // Implemented with a (not fully optimized) Tarjan's union-find algorithm.
    // Implementation of the classic union-find algorithm (unoptimized).
    // Allows any string keys to be unioned into a set of disjoint sets.
    // https://en.wikipedia.org/wiki/Disjoint-set_data_structure
    let unioned = {};
    let setSizes = {};
    let row, col;

    // Finds the set representative for the set that this key is a member of.
    function find(key) {
      let parent = unioned[key];
      if (parent == null) return key;
      parent = find(parent);
      unioned[key] = parent; // Path compression
      return parent;
    }

    // The size of the set represented by 'found'; assume 1 if not stored.
    function setSize(found) {
      return setSizes[found] || 1;
    }

    // Ennsures that the two keys are in the same set, joining if needed.
    // http://stackoverflow.com/a/2326676/265298
    function union(key1, key2) {
      let p1 = find(key1);
      let p2 = find(key2);
      if (p1 == p2) return p1;
      unioned[p2] = p1;
      setSizes[p1] = setSize(p1) + setSize(p2);
      delete setSizes[p2];
    }

    // takes the swap parameter into account
    function getGemOrSwapAt(row, col) {
      // Retrieve the gem at a row and column (depending on vertical)
      const theGem = gameboard.gemAtSquare(row, col);
      if (swap) {
        // If theGem is one of the two gems in the `swap`, return the other gem.
        let index = swap.indexOf(theGem);
        if (index >= 0) {
          return swap[index ^ 1];
        }
      }
      return theGem;
    }

    // Get strips of length 3 (or more).
    const horizontalStreaks = [];
    const verticalStreaks = [];

    // find horizontal streaks, iterating through each row
    for (let row = 0; row < gameboard.dimension; row++) {
      for (let nextCol, col = 0; col < gameboard.dimension; col = nextCol) {
        // Scan row for matches, starting at col
        const gem = getGemOrSwapAt(row, col);
        nextCol = col + 1;
        if (!gem) continue;
        let matches = [gem];
        while (nextCol < gameboard.dimension) {
          const nextGem = getGemOrSwapAt(row, nextCol);
          if (!nextGem || nextGem.letter != gem.letter) break;
          matches.push(nextGem);
          nextCol++;
        }
        // If there are at least 3 gems in the match, add it to streaks.
        if (matches.length >= 3) horizontalStreaks.push(matches);
      }
    }

    // find vertical streaks, iterating through each column
    for (let col = 0; col < gameboard.dimension; col++) {
      for (let nextRow, row = 0; row < gameboard.dimension; row = nextRow) {
        // Scan col for matches, starting at row
        const gem = getGemOrSwapAt(row, col);
        nextRow = row + 1;
        if (!gem) continue;
        let matches = [gem];
        while (nextRow < gameboard.dimension) {
          const nextGem = getGemOrSwapAt(nextRow, col);
          if (!nextGem || nextGem.letter != gem.letter) break;
          matches.push(nextGem);
          nextRow++;
        }
        // If there are at least 3 gems in the match, add it to streaks.
        if (matches.length >= 3) verticalStreaks.push(matches);
      }
    }

    let sets = horizontalStreaks.concat(verticalStreaks);

    // Execute union of all the strips, possibly joining horizontal and vertical strips that intersect.
    for (let j = 0; j < sets.length; j++) {
      let set = sets[j];
      for (let k = 1; k < set.length; k++) {
        union(set[0].id, set[k].id);
      }
    }

    // Pass 2: list out resulting sets of minSize or larger.
    let results = {};
    for (row = 0; row < gameboard.dimension; row++) {
      for (col = 0; col < gameboard.dimension; col++) {
        const gem = gameboard.gemAtSquare(row, col);
        if (gem) {
          const p = find(gem.id);
          if (setSize(p) >= 3) {
            if (!(p in results)) {
              results[p] = [];
            }
            results[p].push(gem);
          }
        }
      }
    }

    // Pass 3: Return results as an array of arrays of gems.
    const arr = [];
    for (const key in results) {
      arr.push(results[key]);
    }
    return arr;
  };

  // Deletes all the gems in arrayOfStreaks (which can be generated by getGemStreaks or by getGemsToCrushGivenMove)
  // Does not shift gems down at all. Updates the score accordingly.
  this.removeGemStreaks = function (arrayOfStreaks) {
    for (let j = 0; j < arrayOfStreaks.length; j++) {
      const streak = arrayOfStreaks[j];
      for (let k = 0; k < streak.length; k++) {
        const gem = streak[k];
        gameboard.remove(gem);
        if (this.keepScore) {
          gameboard.incrementScore(gem, gem.row, gem.col);
          gameboard.updateScoreColor(gem);
        }
      }
    }
  };

  // Moves gems down as far as there are empty spaces.
  // Issues calls to gameboard.moveTo, which generate "move" events to listen for.
  // If there are holes created by moving the gems down, populates the holes with random gems, and issues "add" events for these gems.
  this.moveGemsDown = function () {
    // Collapse each column
    for (let col = 0; col < gameboard.dimension; col++) {
      let emptyRow = null;
      // In each column, scan for the bottom most empty row
      for (let row = gameboard.dimension - 1; row >= 0; row--) {
        emptyRow = row;
        if (gameboard.gemAtSquare(row, col) == null) break;
      }
      // Then shift any nonempty rows up
      for (let row = emptyRow - 1; row >= 0; row--) {
        const gem = gameboard.gemAtSquare(row, col);
        if (gem != null) {
          gameboard.moveTo(gem, emptyRow, col);
          emptyRow--;
        }
      }
      for (let spawnRow = -1; emptyRow >= 0; emptyRow--, spawnRow--) {
        // We report spawnRow as the (negative) position where
        // the gem "would have" started in order to fall into place.
        gameboard.addGemToBoard(emptyRow, col, spawnRow, col);
      }
    }
  };
};
