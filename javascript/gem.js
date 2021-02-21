const values = [1, 2, 3, 4, 5, 6];

class Gem {
  constructor(gemId, getCol, getRow) {
    this.id = gemId;
    this.value = values[Math.floor(Math.random() * values.length)];
    this.getCol = getCol;
    this.getRow = getRow;
  }

  col() {
    return this.getCol(this.id);
  }

  row() {
    return this.getRow(this.id);
  }
}

// module.exports = Game;
