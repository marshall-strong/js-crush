// import $ from "jquery";
// import Game from "./game";

Math.seedrandom(0);

// const canvas = document.getElementById("gameCanvas");
// const game = new Game(canvas);

let game;

// need canvas element before creating game
window.addEventListener("DOMContentLoaded", () => {
  game = new Game();
  $("#mainColumn").html(game.drawGameboard());
});

// jQuery handles user input
$(document).on("mousedown", "#gameCanvas", function (mousedownEvent) {
  game.setMousedownGem(mousedownEvent);
});

$(document).on("mouseup", "#gameCanvas", function (mouseupEvent) {
  game.setMouseupGem(mouseupEvent);
  game.checkMouseEvent();
});

$(document).on("click", "#newGame", function () {
  game.startNewGame();
});

$(document).on("click", "#getHint", function () {
  game.getHint();
});
