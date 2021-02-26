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

  document
    .getElementById("newGame")
    .addEventListener("click", () => game.resetGame());
  document
    .getElementById("autoMove")
    .addEventListener("click", () => game.makeRandomMove());

  $(document).on("mousedown", "#gameCanvas", (mouseEvent) =>
    game.setMouseEventGem(mouseEvent)
  );
  $(document).on("mouseup", "#gameCanvas", (mouseEvent) =>
    game.setMouseEventGem(mouseEvent)
  );

  document
    .getElementById("animalsTheme")
    .addEventListener("click", () => game.setTheme(themes.animals));

  document
    .getElementById("oceanTheme")
    .addEventListener("click", () => game.setTheme(themes.ocean));

  document
    .getElementById("jsTheme")
    .addEventListener("click", () => game.setTheme(themes.js));

  document
    .getElementById("foodTheme")
    .addEventListener("click", () => game.setTheme(themes.food));

  setTimeout(() => game.resetGame(), 30);
});
