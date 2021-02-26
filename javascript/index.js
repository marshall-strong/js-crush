// const Game = require('./game');

// ensures I get the same gems every reset (nice during development)
Math.seedrandom(0);

// waits for the canvas element to load before creating a new game
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const game = new Game(canvas);

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

  document
    .getElementById("newGame")
    .addEventListener("click", () => game.resetGame());

  document
    .getElementById("autoMove")
    .addEventListener("click", () => game.makeRandomMove());

  document.addEventListener("updateScore", () => {
    document.getElementById("pointsEarned").innerHTML = game.pointsEarned;
    document.getElementById("totalPoints").innerHTML = game.totalPoints;
  });

  document
    .getElementById("gameCanvas")
    .addEventListener("mousedown", (e) => game.setMouseEventGem(e));

  document
    .getElementById("gameCanvas")
    .addEventListener("mouseup", (e) => game.setMouseEventGem(e));

  setTimeout(() => game.resetGame(), 30);
});
