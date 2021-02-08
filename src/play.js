// Seed RNG to generate initial board
Math.seedrandom(0);

// data model at global scope for easier debugging
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const col_array = alphabet.split("");

const defaultSize = 8;
const board = new Board(defaultSize);
const game = new Game(board);

let globalCrushCounter = true;
let mouseDownLocation;
let mouseUpLocation;

// update score display when score value changes
$(board).on("scoreUpdate", function (e, info) {
  $("#score").html(board.score);
});

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

// Click and Drag functionality
$(document).on("mousedown", "#gameCanvas", function (event) {
  mouseDownLocation = getCanvasPos(event);
  console.log("mousedown: " + mouseDownLocation);
});
$(document).on("mouseup", "#gameCanvas", function (event) {
  mouseUpLocation = getCanvasPos(event);
  console.log("mouseUp: " + mouseUpLocation);
  $("#mainColumn").html(drawBoard());
  checkDrag();
});

// unused
$(document).on("mousemove", "#gameCanvas", function (event) {});
$(document).on("mouseout", "#gameCanvas", function (event) {});
$(document).on("keydown", function (event) {});
$(document).keypress(function (event) {});

function avaliableMove(dir) {
  var inputCol = col_array.indexOf(mouseDownLocation.charAt(0));
  var inputRow;
  if (mouseDownLocation.length < 3)
    inputRow = Number(mouseDownLocation.charAt(1)) - 1;
  else {
    var temp = mouseDownLocation.charAt(1) + mouseDownLocation.charAt(2);
    inputRow = Number(temp) - 1;
  }
  var currGem = board.gridCellGem(inputRow, inputCol);
  var bool = game.isMoveTypeValid(currGem, dir);
  return bool;
}

function checkMove(dir) {
  console.log(mouseDownLocation);
  console.log(mouseUpLocation);
  var inputRow;
  var inputCol = col_array.indexOf(mouseDownLocation.charAt(0));
  if (mouseDownLocation.length < 3)
    inputRow = Number(mouseDownLocation.charAt(1)) - 1;
  else {
    var temp = mouseDownLocation.charAt(1) + mouseDownLocation.charAt(2);
    inputRow = Number(temp) - 1;
  }
  var currGem = board.gridCellGem(inputRow, inputCol);
  var bool = game.isMoveTypeValid(currGem, dir);
  var canvas = document.getElementById("gameCanvas");
  ctxt = canvas.getContext("2d");
  var gemTo = board.getGemInDirection(currGem, dir);
  const cellSize = 600 / board.dimension;

  var clearWidth, clearHeight;

  var destRow, destCol, originRow, originCol;

  if (dir == "right" || dir == "left") {
    clearWidth = cellSize * 2;
    clearHeight = cellSize;
    var originLetter, destLetter;
    if (currGem.col > gemTo.col) {
      destCol = currGem.col * cellSize;
      originCol = gemTo.col * cellSize;
      originLetter = gemTo.letter;
      destLetter = currGem.letter;
    } else {
      destCol = gemTo.col * cellSize;
      originCol = currGem.col * cellSize;
      originLetter = currGem.letter;
      destLetter = gemTo.letter;
    }
    destRow = gemTo.row * cellSize;
    originRow = currGem.row * cellSize;
    var timer = 0;

    var inter = setInterval(function () {
      ctxt.clearRect(originCol, originRow, clearWidth, clearHeight);

      ctxt.drawImage(
        document.getElementById(originLetter),
        originCol + (timer * cellSize) / 20,
        originRow,
        cellSize,
        cellSize
      );
      ctxt.drawImage(
        document.getElementById(destLetter),
        destCol - (timer * cellSize) / 20,
        destRow,
        cellSize,
        cellSize
      );

      timer++;
      // console.log(timer);
      if (timer == 21) {
        clearInterval(inter);
        flipAndDraw(currGem, dir);
      }
    }, 10);
  } else {
    clearWidth = cellSize;
    clearHeight = cellSize * 2;
    if (currGem.row > gemTo.row) {
      destRow = currGem.row * cellSize;
      originRow = gemTo.row * cellSize;
      originLetter = gemTo.letter;
      destLetter = currGem.letter;
    } else {
      destRow = gemTo.row * cellSize;
      originRow = currGem.row * cellSize;
      originLetter = currGem.letter;
      destLetter = gemTo.letter;
    }
    destCol = gemTo.col * cellSize;
    originCol = currGem.col * cellSize;
    var timer = 0;

    var inter = setInterval(function () {
      ctxt.clearRect(originCol, originRow, clearWidth, clearHeight);

      ctxt.drawImage(
        document.getElementById(originLetter),
        originCol,
        originRow + (timer * cellSize) / 20,
        cellSize,
        cellSize
      );
      ctxt.drawImage(
        document.getElementById(destLetter),
        destCol,
        destRow - (timer * cellSize) / 20,
        cellSize,
        cellSize
      );

      timer++;

      // console.log(timer);
      if (timer == 21) {
        clearInterval(inter);
        flipAndDraw(currGem, dir);
      }
    }, 10);
  }
}

function flipAndDraw(currGem, dir) {
  board.flipGems(currGem, board.getGemInDirection(currGem, dir));
  $("#mainColumn").html(drawBoard());
  document.getElementById("gameCanvas").style.pointerEvents = "none";
  document.getElementById("getHint").disabled = true;

  crushcrush();

  var gg = setInterval(function () {
    if (globalCrushCounter == true) {
      crushcrush();
    } else {
      clearInterval(gg);
      document.getElementById("gameCanvas").style.pointerEvents = "auto";
      document.getElementById("getHint").disabled = false;
    }
  }, 1100);
}

function crushcrush() {
  var listRemove = game.getGemCrushes();
  var canvas = document.getElementById("gameCanvas");
  var cxt = canvas.getContext("2d");
  const cellSize = 600 / board.dimension;
  var alphaCounter = 10;
  if (listRemove.length != 0) {
    var numCrush = listRemove.length;
    var crushLength = listRemove[0].length;

    var alpha = setInterval(function () {
      alphaCounter = alphaCounter - 1;
      cxt.globalAlpha = alphaCounter / 10;
      for (var i = 0; i < numCrush; i++) {
        for (var j = 0; j < crushLength; j++) {
          var letter = String(listRemove[i][j].letter);
          var scoreLetter = listRemove[i][j].letter;
          ctx.clearRect(
            listRemove[i][j].col * cellSize,
            listRemove[i][j].row * cellSize,
            cellSize,
            cellSize
          );
          cxt.drawImage(
            document.getElementById(letter),
            listRemove[i][j].col * cellSize,
            listRemove[i][j].row * cellSize,
            cellSize,
            cellSize
          );
        }
      }
      changeScoreColor(scoreLetter);
      if (alphaCounter <= 0) {
        clearInterval(alpha);
        // console.log('alpha cleared');
      }
    }, 50);
  }

  setTimeout(function () {
    ctx.globalAlpha = 1.0;

    game.removeCrushes(listRemove);

    game.moveGemsDown();

    $("#mainColumn").html(drawBoard());

    listRemove = game.getGemCrushes();
    if (listRemove.length == 0) {
      // document.getElementById("crusher").disabled = true;
      // document.getElementById("inputBox").disabled = false;
      // document.getElementById("inputBox").focus();
      // console.log('crush false');
      globalCrushCounter = false;
    } else {
      document.getElementById("inputBox").disabled = true;
      // console.log('crush true');
      globalCrushCounter = true;
    }
  }, 550);
}

function getAllGem(crushList) {
  var gems = [];
  // console.log(crushList);
  for (var i = 0; i < crushList.length; i++) {
    for (var j = 0; j < crushList[i].length; j++) {
      // console.log(gems);
    }
  }
}

function changeScoreColor(gemLetter) {
  switch (gemLetter) {
    case "gemA":
      document.getElementById("score").style.backgroundColor = "red";
      break;
    case "gemB":
      document.getElementById("score").style.backgroundColor = "green";
      break;
    case "gemC":
      document.getElementById("score").style.backgroundColor = "blue";
      break;
    case "gemD":
      document.getElementById("score").style.backgroundColor = "orange";
      break;
    case "gemE":
      document.getElementById("score").style.backgroundColor = "purple";
      break;
    case "gemF":
      document.getElementById("score").style.backgroundColor = "yellow";
      break;
  }
}

function getCanvasPos(event) {
  var canvasRect = document
    .getElementById("gameCanvas")
    .getBoundingClientRect();

  //Get relative position on canvas
  var xPos = event.clientX - canvasRect.left;
  var yPos = event.clientY - canvasRect.top;

  //Get coordinate
  const cellSize = 600 / board.dimension;
  yPos = Math.floor(yPos / cellSize) + 1;
  xPos = Math.floor(xPos / cellSize);
  xPos = col_array[xPos];

  // console.log({ col: xPos, row: yPos});
  return xPos + yPos;
}

function checkDrag() {
  var originCol = col_array.indexOf(mouseDownLocation.charAt(0));
  var destCol = col_array.indexOf(mouseUpLocation.charAt(0));
  var spliceSize = board.dimension > 9 ? 2 : 1;
  var originRow = mouseDownLocation.substr(1, spliceSize);
  var destRow = mouseUpLocation.substr(1, spliceSize);

  if (originCol == destCol) {
    //moving up or down
    if (originRow < destRow) {
      if (avaliableMove("down")) {
        checkMove("down");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    } else {
      if (avaliableMove("up")) {
        checkMove("up");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    }
  } else {
    if (originCol < destCol) {
      if (avaliableMove("right")) {
        checkMove("right");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    } else {
      if (avaliableMove("left")) {
        checkMove("left");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    }
    //moving left or right
  }
}

function drawBoard() {
  const cellSize = 600 / board.dimension;
  const canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  // draw grid container
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "white";
  // iterate through gridCells
  for (let row = 0; row < board.dimension; row++) {
    for (let col = 0; col < board.dimension; col++) {
      const dx = col * cellSize;
      const dy = row * cellSize;
      const dWidth = cellSize;
      const dHeight = cellSize;
      // draw cell outline
      ctx.strokeRect(dx, dy, dWidth, dHeight);
      const gem = board.gridCellGem(row, col);
      const gemImage = document.getElementById(gem.letter);
      // draw gemImage
      ctx.drawImage(gemImage, dx, dy, dWidth, dHeight);
    }
  }
}
