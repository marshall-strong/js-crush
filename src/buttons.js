// New Game button
$(document).on("click", "#newGame", function (event) {
  game.clearGameboard();
  game.setupGameboard();
  $("#mainColumn").html(drawBoard());
  board.resetScore();
});

// Get Hint button
$(document).on("click", "#getHint", function (event) {
  const helpMove = game.getRandomValidMove();
  const cellSize = 600 / board.dimension;
  const arrowLength = cellSize / 4;
  var canvas = document.getElementById("gameCanvas");
  var ctx2 = canvas.getContext("2d");
  ctx2.beginPath();
  posY = (helpMove.gem.row + 1) * cellSize;
  posX = helpMove.gem.col * cellSize;
  ctx2.strokeStyle = "black";

  switch (helpMove.direction) {
    case "right":
      $("#mainColumn").html(drawBoard());
      posX = posX + cellSize * 1.2;
      posY = posY - cellSize / 2;
      ctx2.moveTo(posX, posY);
      ctx2.lineTo(posX - arrowLength, posY - arrowLength);
      ctx2.lineTo(posX - arrowLength, posY + arrowLength);
      ctx2.fill();
      ctx2.rect(
        posX - arrowLength * 2,
        posY - arrowLength / 2,
        arrowLength,
        arrowLength
      );
      ctx2.fill();
      break;
    case "left":
      $("#mainColumn").html(drawBoard());
      posX = posX - cellSize / 4;
      posY = posY - cellSize / 2;
      ctx2.moveTo(posX, posY);
      ctx2.lineTo(posX + arrowLength, posY + arrowLength);
      ctx2.lineTo(posX + arrowLength, posY - arrowLength);
      ctx2.fill();
      ctx2.rect(
        posX + arrowLength,
        posY - arrowLength / 2,
        arrowLength,
        arrowLength
      );
      ctx2.fill();
      break;
    case "up":
      $("#mainColumn").html(drawBoard());
      posY = posY - cellSize * 1.2;
      posX = posX + cellSize / 2;
      ctx2.moveTo(posX, posY);
      ctx2.lineTo(posX - arrowLength, posY + arrowLength);
      ctx2.lineTo(posX + arrowLength, posY + arrowLength);
      ctx2.fill();
      ctx2.rect(
        posX - arrowLength / 2,
        posY + arrowLength,
        arrowLength,
        arrowLength
      );
      ctx2.fill();
      break;
    case "down":
      $("#mainColumn").html(drawBoard());
      posY = posY + cellSize / 4;
      posX = posX + cellSize / 2;
      ctx2.moveTo(posX, posY);
      ctx2.lineTo(posX + arrowLength, posY - arrowLength);
      ctx2.lineTo(posX - arrowLength, posY - arrowLength);
      ctx2.fill();
      ctx2.rect(
        posX - arrowLength / 2,
        posY - arrowLength * 2,
        arrowLength,
        arrowLength
      );
      ctx2.fill();
      break;
  }
  ctx2.closePath();
});
