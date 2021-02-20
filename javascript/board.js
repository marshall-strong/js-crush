class Board {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.nextGemId = 0;
    this.grid = new Array(this.gridSize);
    for (let row = 0; row < this.gridSize; row++) {
      this.grid[row] = new Array(this.gridSize);
      for (let col = 0; col < this.gridSize; col++) {
        this.grid[row][col] = null;
      }
    }
  }

  getCol(gemId) {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] && this.grid[row][col].id === gemId) {
          return col;
        }
      }
    }
    return null;
  }

  getRow(gemId) {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] && this.grid[row][col].id === gemId) {
          return row;
        }
      }
    }
    return null;
  }

  gem(col, row) {
    if (col >= 0 && col < this.gridSize && row >= 0 && row < this.gridSize) {
      return this.grid[row][col];
    } else {
      return undefined;
    }
  }

  addNewGem(col, row) {
    const id = this.nextGemId++;
    const getCol = this.getCol.bind(this);
    const getRow = this.getRow.bind(this);
    const newGem = new Gem(id, getCol, getRow);
    this.grid[row][col] = newGem;
  }

  updateGem(gem, newCol, newRow) {
    this.grid[newRow][newCol] = gem;
  }

  swapGems(gem1, gem2) {
    const gem1Col = this.getCol(gem1.id);
    const gem1Row = this.getRow(gem1.id);
    const gem2Col = this.getCol(gem2.id);
    const gem2Row = this.getRow(gem2.id);
    this.grid[gem1Row][gem1Col] = gem2;
    this.grid[gem2Row][gem2Col] = gem1;
  }

  relativePosition(gem1, gem2) {
    const dx = gem2.col() - gem1.col();
    const dy = gem2.row() - gem1.row();
    let direction;
    if (dx === 1 && dy === 0) direction = "right";
    if (dx === 0 && dy === 1) direction = "down";
    if (dx === -1 && dy === 0) direction = "left";
    if (dx === 0 && dy === -1) direction = "up";
    return direction;
  }

  removeGem(gem) {
    const col = this.getCol(gem.id);
    const row = this.getRow(gem.id);
    this.grid[row][col] = null;
  }

  removeGems(gems) {
    for (let i = 0; i < gems.length; i++) {
      this.removeGem(gems[i]);
    }
  }

  adjacentGems(gem) {
    const gems = [];
    const col = this.getCol(gem.id);
    const row = this.getRow(gem.id);
    let right, down, left, up;
    // check if square is on the board (passing -1 as a row value causes errors)
    if (col + 1 < this.gridSize) right = this.gem(col + 1, row);
    if (row + 1 < this.gridSize) down = this.gem(col, row + 1);
    if (col - 1 >= 0) left = this.gem(col - 1, row);
    if (row - 1 >= 0) up = this.gem(col, row - 1);
    // check if square contains a gem
    if (right) gems.push(right);
    if (down) gems.push(down);
    if (left) gems.push(left);
    if (up) gems.push(up);
    // return adjacent gems
    return gems;
  }

  randomize() {
    // flatten the grid into a single array of gems
    const array = [].concat.apply([], this.grid);

    // shuffle array (https://github.com/coolaj86/knuth-shuffle)
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // ...pick one of the remaining elements...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // ...and swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    // iterate through grid squares and place a gem at each
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const gem = array.pop();
        this.updateGem(gem, col, row);
      }
    }
  }

  findMatches() {
    // Implemented with a (not fully optimized) Tarjan's union-find algorithm.
    // Implementation of the classic union-find algorithm (unoptimized).
    // Allows any string keys to be unioned into a set of disjoint sets.
    // https://en.wikipedia.org/wiki/Disjoint-set_data_structure

    let unioned = {};
    let setSizes = {};

    // Finds the set representative for the set that this key is a member of.
    const findSet = (key) => {
      let parent = unioned[key];
      if (parent == null) {
        return key;
      } else {
        parent = findSet(parent);
        unioned[key] = parent; // path compression
        return parent;
      }
    };

    // Returns the size of the set represented by `found` -- assumes 1 if not stored.
    const setSize = (set) => setSizes[set] || 1;

    // Ensures that both keys are in the same set, joining the sets if needed.
    // http://stackoverflow.com/a/2326676/265298
    const union = (key1, key2) => {
      let parent1 = findSet(key1);
      let parent2 = findSet(key2);
      if (parent1 == parent2) {
        return parent1;
      } else {
        unioned[parent2] = parent1;
        setSizes[parent1] = setSize(parent1) + setSize(parent2);
        delete setSizes[parent2];
      }
    };

    // Iterates through each row and adds streaks of 3+ gems to `hStreaks`.
    const horizontalStreaks = () => {
      const hStreaks = [];
      for (let row = 0; row < this.gridSize; row++) {
        for (let col = 0; col < this.gridSize; col++) {
          const gem = this.gem(col, row);
          if (gem) {
            const streak = [gem];
            let nextCol = col + 1;
            while (nextCol < this.gridSize) {
              const nextGem = this.gem(nextCol, row);
              if (nextGem && nextGem.value === gem.value) {
                streak.push(nextGem);
                nextCol++;
              } else {
                break;
              }
            }
            if (streak.length >= 3) hStreaks.push(streak);
          } else {
            continue;
          }
        }
      }
      return hStreaks;
    };

    // Iterates through each col and adds streaks of 3+ gems to `vStreaks`.
    const verticalStreaks = () => {
      const vStreaks = [];
      for (let col = 0; col < this.gridSize; col++) {
        for (let row = 0; row < this.gridSize; row++) {
          const gem = this.gem(col, row);
          if (gem) {
            const streak = [gem];
            let nextRow = row + 1;
            while (nextRow < this.gridSize) {
              const nextGem = this.gem(col, nextRow);
              if (nextGem && nextGem.value === gem.value) {
                streak.push(nextGem);
                nextRow++;
              } else {
                break;
              }
            }
            if (streak.length >= 3) vStreaks.push(streak);
          } else {
            continue;
          }
        }
      }
      return vStreaks;
    };

    // Executes a union of hStreaks and vStreaks, joining any that overlap.
    const streaks = horizontalStreaks().concat(verticalStreaks());
    for (let i = 0; i < streaks.length; i++) {
      const streak = streaks[i];
      for (let j = 1; j < streak.length; j++) {
        const gem1 = streak[0];
        const gem2 = streak[j];
        union(gem1.id, gem2.id);
      }
    }

    // Lists out post-union matches (streaks that are >= 3).
    // In the future, this step could handle "special candies".
    let matchesObj = {};
    for (row = 0; row < this.gridSize; row++) {
      for (col = 0; col < this.gridSize; col++) {
        const gem = this.gem(col, row);
        if (gem) {
          const streak = findSet(gem.id);
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
}
