// Seed RNG to generate initial board
Math.seedrandom(0);

const defaultSize = 8;
const board = new Board(defaultSize);
const game = new Game(board);

// width and height (in pixels) of the gameCanvas
// Need to make the canvas size responsive using CSS,
// then somehow get the size here to use in later calculations...
const gameCanvasSize = 600;

// update score display when score value changes
$(board).on("scoreUpdate", function (e, info) {
  $("#score").html(board.score);
});
