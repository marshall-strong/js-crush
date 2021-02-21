const values = ["gemA", "gemB", "gemC", "gemD", "gemE", "gemF"];

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
