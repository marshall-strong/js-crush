const values = [
  "gemValue1",
  "gemValue2",
  "gemValue3",
  "gemValue4",
  "gemValue5",
  "gemValue6",
];

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

// export default Gem;
