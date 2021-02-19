// theme dictates the images to use when drawing the gems
const themes = {
  animals: {
    gemA: "11-goose",
    gemB: "12-giraffe",
    gemC: "13-goat",
    gemD: "14-unicorn",
    gemE: "15-curly_horn",
    gemF: "16-blue_bull",
  },
  jsGems: {
    gemA: "github",
    gemB: "react",
    gemC: "javascript",
    gemD: "nodejs",
    gemE: "webpack",
    gemF: "jquery",
  },
};

// ensures I get the same gems every reset (nice during development)
Math.seedrandom(0);

// waits for the canvas element to load before creating a new game
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const game = new Game(canvas);
  game.reset();

  // handles users clicking on buttons
  $(document).on("click", "#newGame", function () {
    game.reset();
  });

  $(document).on("click", "#getHint", function () {
    game.getHint();
  });

  $(document).on("click", "#autoMove", function () {
    game.autoMove();
  });

  $(document).on("click", "#shuffleBoard", function () {
    game.shuffle();
  });

  // handles users clicking/dragging gems on the board
  $(document).on("mousedown", "#gameCanvas", function (mousedownEvent) {
    game.setMousedownGem(mousedownEvent);
  });

  $(document).on("mouseup", "#gameCanvas", function (mouseupEvent) {
    game.setMouseupGem(mouseupEvent);
    game.checkMouseEvent();
  });
});
