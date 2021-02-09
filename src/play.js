// Seed RNG to generate initial board
Math.seedrandom(0);

// data model at global scope for easier debugging
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const col_array = alphabet.split("");

const defaultSize = 8;
const board = new Board(defaultSize);
const game = new Game(board);

function getCanvasPos(event) {
  const canvas = document.getElementById("gameCanvas");
  const canvasRect = canvas.getBoundingClientRect();
  // get relative position on canvas
  var xPos = event.clientX - canvasRect.left;
  var yPos = event.clientY - canvasRect.top;
  // get coordinate
  const cellSize = 600 / board.dimension;
  xCol = col_array[Math.floor(xPos / cellSize)];
  yRow = Math.floor(yPos / cellSize) + 1;
  // log coordinate
  console.log({ col: xCol, row: yRow });
  return xCol + yRow;
}

function drawBoard() {
  const cellSize = 600 / board.dimension;
  const canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  // draw grid container
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "white";
  // iterate through gridCells
  for (let row = 0; row < board.dimension; row++) {
    for (let col = 0; col < board.dimension; col++) {
      const dx = col * cellSize;
      const dy = row * cellSize;
      const dWidth = cellSize;
      const dHeight = cellSize;
      // draw cell outline
      ctx.strokeRect(dx, dy, dWidth, dHeight);
      const gem = board.gridCellGem(row, col);
      const gemImage = document.getElementById(gem.letter);
      // draw gemImage
      ctx.drawImage(gemImage, dx, dy, dWidth, dHeight);
    }
  }
}
