const Game = function (board) {
  ////////////////////////////////////////////////
  // GAME PROPERTIES

  Object.defineProperty(this, "gameboard", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: board,
  });

  Object.defineProperty(this, "keepScore", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: false,
  });

  ////////////////////////////////////////////////
  // GAME SETUP

  this.clearGameboard = function () {
    for (let col = 0; col < board.dimension; col++) {
      for (let row = 0; row < board.dimension; row++) {
        board.removeAt(row, col);
      }
    }
  };

  this.setupGameboard = function () {
    // disable scoring during game setup
    this.keepScore = false;
    // populate gameboard
    while (true) {
      // iterate through gameboard, adding gems to empty cells
      for (let col = 0; col < board.dimension; col++) {
        for (let row = 0; row < board.dimension; row++) {
          if (board.gridCellGem(row, col) == null)
            board.addGemToBoard(row, col);
        }
      }
      // once all cells are filled, check gameboard for matches
      const crushable = this.getGemCrushes();
      // if no matches are found, exit setup and begin gameplay
      if (crushable.length == 0) break;
      // remove any matches found, then continue the loop to add more gems
      this.removeCrushes(crushable);
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
    const toGem = board.getGemInDirection(fromGem, direction);

    if (!toGem || toGem.letter == fromGem.letter) {
      return [];
    }
    const swap = [fromGem, toGem];
    const crushable = this.getGemCrushes(swap);
    // Only return crushable groups that involve the swapped gems.
    // If the board has incompletely-resolved crushes, there can be many crushable gems that are not touching the swapped ones.
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

    // For each cell in the board, check to see if moving it in any of the four directions would result in a crush.
    // If yes, add it to the appropriate list (validMoves_threeCrush for crushes where setSize === 3, validMoves_moreThanThreeCrush for crushes where setSize > 3)
    for (let row = 0; row < board.dimension; row++) {
      for (let col = 0; col < board.dimension; col++) {
        const fromGem = board.gridCellGem(row, col);
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

  // Returns a list of ALL gem crushes on the board.
  // A gem crush is a list of three or more gems in a single row or column that have the same letter.
  // Each crush is provided as a list of the gems being crushed, resulting in a list of lists.
  // The output of this method is passed directly into this.removeCrushes to remove gem crushes.
  this.getGemCrushes = function (swap) {
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
      let p1 = find(key1),
        p2 = find(key2);
      if (p1 == p2) return p1;
      unioned[p2] = p1;
      setSizes[p1] = setSize(p1) + setSize(p2);
      delete setSizes[p2];
    }

    // Get strips of length 3 (or more).
    let vert = this.findStreaks(true, swap);
    let horiz = this.findStreaks(false, swap);
    let sets = vert.concat(horiz);

    // Execute union of all the strips, possibly joining horizontal and vertical strips that intersect.
    for (let j = 0; j < sets.length; j++) {
      let set = sets[j];
      for (let k = 1; k < set.length; k++) {
        union(set[0].id, set[k].id);
      }
    }

    // Pass 2: list out resulting sets of minSize or larger.
    let results = {};
    for (row = 0; row < board.dimension; row++) {
      for (col = 0; col < board.dimension; col++) {
        const gem = board.gridCellGem(row, col);
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

    // Pass 3: Return results as a list of list of gems.
    const list = [];
    for (const key in results) {
      list.push(results[key]);
    }
    return list;
  };

  // Helper Method for game.getGemCrushes
  // Returns a set of sets of all the same-letter gem strips of length at least 3 on the board.
  // If 'vertical' is set to true, only look for vertical strips.
  // Otherwise, only look for horizontal strips.
  // If the 'swap' array is passed, then every even-indexed gem in the array is considered swapped with every odd-indexed gem in the array.
  this.findStreaks = function (vertical, swap) {
    const getAt = (x, y) => {
      // Retrieve the gem at a row and column (depending on vertical)
      let result = vertical ? board.gridCellGem(y, x) : board.gridCellGem(x, y);
      if (swap) {
        // If the result gem is in the 'swap' array, then swap the result with its adjacent pair.
        let index = swap.indexOf(result);
        if (index >= 0) {
          return swap[index ^ 1];
        }
      }
      return result;
    };

    const streaks = [];

    for (let j = 0; j < board.dimension; j++) {
      for (let h, k = 0; k < board.dimension; k = h) {
        // Scan for rows of same-lettered gem starting at k
        const gem = getAt(j, k);
        h = k + 1;
        if (!gem) continue;
        let gems = [gem];
        while (h < board.dimension) {
          const nextGem = getAt(j, h);
          if (!nextGem || nextGem.letter != gem.letter) break;
          gems.push(nextGem);
          h++;
        }
        // If there are at least 3 gems in a row, remember the set.
        if (gems.length >= 3) streaks.push(gems);
      }
    }

    return streaks;
  };

  // Deletes all the gems in setOfSetsOfCrushes (which can be generated by getGemCrushes or by getGemsToCrushGivenMove)
  // Does not shift gems down at all. Updates the score accordingly.
  this.removeCrushes = function (setOfSetsOfCrushes) {
    for (let j = 0; j < setOfSetsOfCrushes.length; j++) {
      const set = setOfSetsOfCrushes[j];
      for (let k = 0; k < set.length; k++) {
        if (this.keepScore) {
          board.incrementScore(set[k], set[k].row, set[k].col);
        }
        board.remove(set[k]);
      }
    }
  };

  // Moves gems down as far as there are empty spaces.
  // Issues calls to board.moveTo, which generate "move" events to listen for.
  // If there are holes created by moving the gems down, populates the holes with random gems, and issues "add" events for these gems.
  this.moveGemsDown = function () {
    // Collapse each column
    for (let col = 0; col < board.dimension; col++) {
      let emptyRow = null;
      // In each column, scan for the bottom most empty row
      for (let row = board.dimension - 1; row >= 0; row--) {
        emptyRow = row;
        if (board.gridCellGem(emptyRow, col) == null) {
          break;
        }
      }
      // Then shift any nonempty rows up
      for (let row = emptyRow - 1; row >= 0; row--) {
        const gem = board.gridCellGem(row, col);
        if (gem != null) {
          board.moveTo(gem, emptyRow, col);
          emptyRow--;
        }
      }
      for (let spawnRow = -1; emptyRow >= 0; emptyRow--, spawnRow--) {
        // We report spawnRow as the (negative) position where
        // the gem "would have" started to fall into place.
        board.addGemToBoard(emptyRow, col, spawnRow, col);
      }
    }
  };
};
