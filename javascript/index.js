Math.seedrandom(0);

window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const game = new Game(canvas);

  window.addEventListener("resize", () => game.drawGameboard());

  document
    .getElementById("farm")
    .addEventListener("click", () => game.setTheme(themes.farm));

  document
    .getElementById("candy")
    .addEventListener("click", () => game.setTheme(themes.candy));

  document
    .getElementById("web")
    .addEventListener("click", () => game.setTheme(themes.web));

  document
    .getElementById("food")
    .addEventListener("click", () => game.setTheme(themes.food));

  document
    .getElementById("ocean")
    .addEventListener("click", () => game.setTheme(themes.ocean));

  document
    .getElementById("newGame")
    .addEventListener("click", () => game.resetGame());

  document
    .getElementById("autoMove")
    .addEventListener("click", () => game.makeRandomMove());

  document
    .getElementById("autoPlay")
    .addEventListener("click", () => game.toggleAutoPlay());

  document
    .getElementById("gameCanvas")
    .addEventListener("mousedown", (e) => game.setMouseEventGem(e));

  document
    .getElementById("gameCanvas")
    .addEventListener("mouseup", (e) => game.setMouseEventGem(e));

  document.addEventListener("updateScore", () => {
    document.getElementById("gemsRemoved").innerHTML = game.totalGemsRemoved;
    // document.getElementById("pointsEarned").innerHTML = game.pointsEarned;
    // document.getElementById("totalPoints").innerHTML = game.totalPoints;
  });

  setTimeout(() => game.resetGame(), 30);
});
