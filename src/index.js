// Seed RNG to generate initial board
Math.seedrandom(0);

const alphabet = "abcdefghijklmnopqrstuvwxyz";
const col_array = alphabet.split("");

const defaultSize = 8;
const board = new Board(defaultSize);
const game = new Game(board);

// width and height (in pixels) of the gameCanvas
const gameCanvasSize = 600;

// game.setupGameboard();
// game.drawBoard();
// board.resetScore();

// update score display when score value changes
$(board).on("scoreUpdate", function (e, info) {
  $("#score").html(board.score);
});
