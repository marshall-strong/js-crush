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

  $(document).on("click", "#newGame", () => game.reset());
  $(document).on("click", "#getHint", () => game.getHint());
  $(document).on("click", "#autoMove", () => game.autoMove());
  $(document).on("click", "#shuffleBoard", () => game.shuffle());

  $(document).on("mousedown", "#gameCanvas", (mousedown) => {
    game.mousedownGem = game.getMouseEventGem(mousedown);
  });

  $(document).on("mouseup", "#gameCanvas", (mouseup) => {
    game.mouseupGem = game.getMouseEventGem(mouseup);
    game.checkMouseEvent();
  });
});
