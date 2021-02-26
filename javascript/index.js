Math.seedrandom(0);

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const game = new Game(canvas);

  window.addEventListener("resize", () => game.setCanvasSize());

  document
    .getElementById("animalsTheme")
    .addEventListener("click", () => game.setTheme(themes.animals));

  document
    .getElementById("oceanTheme")
    .addEventListener("click", () => game.setTheme(themes.ocean));

  document
    .getElementById("jsTheme")
    .addEventListener("click", () => game.setTheme(themes.javascript));

  document
    .getElementById("foodTheme")
    .addEventListener("click", () => game.setTheme(themes.food));

  document
    .getElementById("newGame")
    .addEventListener("click", () => game.resetGame());

  document
    .getElementById("autoMove")
    .addEventListener("click", () => game.makeRandomMove());

  document
    .getElementById("gameCanvas")
    .addEventListener("mousedown", (e) => game.setMouseEventGem(e));

  document
    .getElementById("gameCanvas")
    .addEventListener("mouseup", (e) => game.setMouseEventGem(e));

  document.addEventListener("updateScore", () => {
    document.getElementById("pointsEarned").innerHTML = game.pointsEarned;
    document.getElementById("totalPoints").innerHTML = game.totalPoints;
  });

  setTimeout(() => game.resetGame(), 30);
});
