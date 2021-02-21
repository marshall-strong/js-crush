// const Game = require('./game');

// ensures I get the same gems every reset (nice during development)
Math.seedrandom(0);

// waits for the canvas element to load before creating a new game
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const game = new Game(canvas);

  $(game).on("scoreUpdate", () => {
    $("#pointsEarned").html(game.pointsEarned);
    $("#totalPoints").html(game.totalPoints);
  });

  $(document).on("click", "#newGame", () => game.resetGame());
  $(document).on("click", "#getHint", () => game.showRandomMove());
  $(document).on("click", "#autoMove", () => game.makeRandomMove());
  $(document).on("click", "#shuffleBoard", () => game.shuffleGameboard());

  $(document).on("mousedown", "#gameCanvas", (mouseEvent) =>
    game.setMouseEventGem(mouseEvent)
  );
  $(document).on("mouseup", "#gameCanvas", (mouseEvent) =>
    game.setMouseEventGem(mouseEvent)
  );

  setTimeout(() => game.resetGame(), 30);
});
