// The selected theme determines which images to use when drawing the gems.
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

  $(game).on("scoreUpdate", () => {
    $("#pointsEarned").html(game.pointsEarned);
    $("#totalPoints").html(game.totalPoints);
  });

  $(document).on("click", "#newGame", () => {
    if (game.status === "ready") {
      game.resetGame();
    }
  });

  $(document).on("click", "#autoMove", () => {
    if (game.status === "ready") {
      game.makeRandomMove();
    }
  });

  $(document).on("click", "#getHint", () => game.showRandomMove());
  $(document).on("click", "#shuffleBoard", () => game.shuffleGameboard());

  $(document).on("mousedown", "#gameCanvas", (mouseEvent) =>
    game.setMouseEventGem(mouseEvent)
  );

  $(document).on("mouseup", "#gameCanvas", (mouseEvent) =>
    game.setMouseEventGem(mouseEvent)
  );

  setTimeout(() => game.resetGame(), 30);
});
