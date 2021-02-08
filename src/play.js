// Seed RNG to generate initial board
Math.seedrandom(0);

// data model at global scope for easier debugging
const alphabet = "abcdefghijklmnopqrstuvwxyz";
const col_array = alphabet.split("");

const defaultSize = 8;
const board = new Board(defaultSize);
const game = new Game(board);

var inputBoxInfo;
var validInput = false;
var image_array;
var globalCrushCounter = true;
var mouseDownLocation;
var mouseUpLocation;

// move a gem on the board
$(board).on("scoreUpdate", function (e, info) {
  $("#score").html(board.score);
});

// keyboard events arrive here
$(document).on("keydown", function (event) {
  // Your code here.
});

// Button Events
$(document).on("click", "#newGame", function (event) {
  game.clearGameboard();
  game.setupGameboard();
  $("#mainColumn").html(drawBoard());
  board.resetScore();
});

$(document).keypress(function (event) {
  if (event.which == 13) {
    checkInput();
  }
});

function checkInput() {
  inputBoxInfo = document.getElementById("inputBox").value;
  // console.log(inputBoxInfo.length);
  if (inputBoxInfo.length <= 3) {
    var bool1 = col_array.indexOf(inputBoxInfo.charAt(0)) != -1;
    var bool2 =
      Number(inputBoxInfo.charAt(1)) > 0 &&
      Number(inputBoxInfo.charAt(1)) <= 20;
    if (bool1 && bool2) {
      validInput = true;
      var counter = 0;
      if (avaliableMove("up")) {
        document.getElementById("up").disabled = false;
        counter++;
      }
      if (avaliableMove("left")) {
        document.getElementById("left").disabled = false;
        counter++;
      }
      if (avaliableMove("right")) {
        document.getElementById("right").disabled = false;
        counter++;
      }
      if (avaliableMove("down")) {
        document.getElementById("down").disabled = false;
        counter++;
      }
      if (counter > 0) return;
    }
  }
  // console.log("hello");
  document.getElementById("inputBox").value = null;
  document.getElementById("inputBox").focus();
  document.getElementById("up").disabled = true;
  document.getElementById("left").disabled = true;
  document.getElementById("right").disabled = true;
  document.getElementById("down").disabled = true;
}

$(document).on("click", "#up", function (event) {
  if (validInput) checkMove("up");
});

$(document).on("click", "#left", function (event) {
  if (validInput) checkMove("left");
});

$(document).on("click", "#right", function (event) {
  if (validInput) checkMove("right");
});

$(document).on("click", "#down", function (event) {
  if (validInput) checkMove("down");
});

function avaliableMove(dir) {
  var inputCol = col_array.indexOf(mouseDownLocation.charAt(0));
  var inputRow;
  if (mouseDownLocation.length < 3)
    inputRow = Number(mouseDownLocation.charAt(1)) - 1;
  else {
    var temp = mouseDownLocation.charAt(1) + mouseDownLocation.charAt(2);
    inputRow = Number(temp) - 1;
  }
  var currGem = board.gemAt(inputRow, inputCol);
  var bool = game.isMoveTypeValid(currGem, dir);
  return bool;
}

function checkMove(dir) {
  // var inputCol = col_array.indexOf(inputBoxInfo.charAt(0));
  // var inputRow;
  // if(inputBoxInfo.length < 3)
  //  inputRow = Number(inputBoxInfo.charAt(1))-1;
  // else {
  //   var temp = inputBoxInfo.charAt(1) + inputBoxInfo.charAt(2);
  //   inputRow = Number(temp) -1;
  // }
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
  var currGem = board.gemAt(inputRow, inputCol);
  var bool = game.isMoveTypeValid(currGem, dir);
  var canvas = document.getElementById("Canvas");
  ctxt = canvas.getContext("2d");
  var gemTo = board.getGemInDirection(currGem, dir);
  var size = 600 / board.size;

  var clearWidth, clearHeight;

  var destRow, destCol, originRow, originCol;

  if (dir == "right" || dir == "left") {
    clearWidth = size * 2;
    clearHeight = size;
    var originLetter, destLetter;
    if (currGem.col > gemTo.col) {
      destCol = currGem.col * size;
      originCol = gemTo.col * size;
      originLetter = gemTo.letter;
      destLetter = currGem.letter;
    } else {
      destCol = gemTo.col * size;
      originCol = currGem.col * size;
      originLetter = currGem.letter;
      destLetter = gemTo.letter;
    }
    destRow = gemTo.row * size;
    originRow = currGem.row * size;
    var timer = 0;

    var inter = setInterval(function () {
      // console.log('switching here');
      ctxt.clearRect(originCol, originRow, clearWidth, clearHeight);

      ctxt.drawImage(
        document.getElementById(originLetter),
        originCol + (timer * size) / 20,
        originRow,
        size,
        size
      );
      ctxt.drawImage(
        document.getElementById(destLetter),
        destCol - (timer * size) / 20,
        destRow,
        size,
        size
      );

      timer++;
      // console.log(timer);
      if (timer == 21) {
        clearInterval(inter);
        flipAndDraw(currGem, dir);
      }
    }, 10);
  } else {
    clearWidth = size;
    clearHeight = size * 2;
    if (currGem.row > gemTo.row) {
      destRow = currGem.row * size;
      originRow = gemTo.row * size;
      originLetter = gemTo.letter;
      destLetter = currGem.letter;
    } else {
      destRow = gemTo.row * size;
      originRow = currGem.row * size;
      originLetter = currGem.letter;
      destLetter = gemTo.letter;
    }
    destCol = gemTo.col * size;
    originCol = currGem.col * size;
    var timer = 0;

    var inter = setInterval(function () {
      ctxt.clearRect(originCol, originRow, clearWidth, clearHeight);

      ctxt.drawImage(
        document.getElementById(originLetter),
        originCol,
        originRow + (timer * size) / 20,
        size,
        size
      );
      ctxt.drawImage(
        document.getElementById(destLetter),
        destCol,
        destRow - (timer * size) / 20,
        size,
        size
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
  // console.log(currGem);
  board.flipGems(currGem, board.getGemInDirection(currGem, dir));

  // ctxt.clearRect(0, 0, canvas.width, canvas.height);
  $("#mainColumn").html(drawBoard());

  document.getElementById("inputBox").value = null;
  document.getElementById("inputBox").focus();
  validInput = false;
  document.getElementById("up").disabled = true;
  document.getElementById("left").disabled = true;
  document.getElementById("right").disabled = true;
  document.getElementById("down").disabled = true;
  document.getElementById("crusher").disabled = false;
  document.getElementById("inputBox").disabled = true;
  document.getElementById("Canvas").style.pointerEvents = "none";
  document.getElementById("getHint").disabled = true;

  var counter = true;
  crushcrush();

  var gg = setInterval(function () {
    // console.log(counter);
    if (globalCrushCounter == true) {
      // console.log(globalCrushCounter);
      crushcrush();
    } else {
      clearInterval(gg);
      document.getElementById("Canvas").style.pointerEvents = "auto";
      document.getElementById("getHint").disabled = false;
    }
  }, 1100);
}

function crushcrush() {
  var listRemove = game.getGemCrushes();
  var canvas = document.getElementById("Canvas");
  var cxt = canvas.getContext("2d");
  var size = 600 / board.size;
  var alphaCounter = 10;
  if (listRemove.length != 0) {
    var numCrush = listRemove.length;
    var crushLength = listRemove[0].length;

    var alpha = setInterval(function () {
      alphaCounter = alphaCounter - 1;
      cxt.globalAlpha = alphaCounter / 10;
      // console.log(alphaCounter/10);
      for (var i = 0; i < numCrush; i++) {
        for (var j = 0; j < crushLength; j++) {
          var letter = String(listRemove[i][j].letter);
          var scoreLetter = listRemove[i][j].letter;
          ctx.clearRect(
            listRemove[i][j].col * size,
            listRemove[i][j].row * size,
            size,
            size
          );
          cxt.drawImage(
            document.getElementById(letter),
            listRemove[i][j].col * size,
            listRemove[i][j].row * size,
            size,
            size
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
      document.getElementById("crusher").disabled = true;
      document.getElementById("inputBox").disabled = false;
      document.getElementById("inputBox").focus();
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

function drawGem(row, col, size, letter) {
  switch (letter) {
    case "gemA":
      ctx.drawImage(
        document.getElementById("gemA"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
    case "gemB":
      ctx.drawImage(
        document.getElementById("gemB"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
    case "gemC":
      ctx.drawImage(
        document.getElementById("gemC"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
    case "gemD":
      ctx.drawImage(
        document.getElementById("gemD"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
    case "gemE":
      ctx.drawImage(
        document.getElementById("gemE"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
    case "gemF":
      ctx.drawImage(
        document.getElementById("gemF"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
  }
}

$(document).on("click", "#getHint", function (event) {
  var helpMove = game.getRandomValidMove();
  // console.log(helpMove.gem);
  // console.log(helpMove.direction);
  var size = 600 / board.size;
  var canvas = document.getElementById("Canvas");
  var ctx2 = canvas.getContext("2d");
  ctx2.beginPath();
  posY = (helpMove.gem.row + 1) * size;
  posX = helpMove.gem.col * size;
  ctx2.strokeStyle = "black";
  var arrowSize = size / 4;
  // console.log(arrowSize);

  switch (helpMove.direction) {
    case "right":
      // ctx2.clearRect(0, 0, canvas.width, canvas.height);
      $("#mainColumn").html(drawBoard());
      posX = posX + size * 1.2;
      posY = posY - size / 2;
      ctx2.moveTo(posX, posY);
      ctx2.lineTo(posX - arrowSize, posY - arrowSize);
      ctx2.lineTo(posX - arrowSize, posY + arrowSize);
      ctx2.fill();
      ctx2.rect(
        posX - arrowSize * 2,
        posY - arrowSize / 2,
        arrowSize,
        arrowSize
      );
      ctx2.fill();
      break;
    case "left":
      // ctx2.clearRect(0, 0, canvas.width, canvas.height);
      $("#mainColumn").html(drawBoard());
      posX = posX - size / 4;
      posY = posY - size / 2;
      ctx2.moveTo(posX, posY);
      ctx2.lineTo(posX + arrowSize, posY + arrowSize);
      ctx2.lineTo(posX + arrowSize, posY - arrowSize);
      ctx2.fill();
      ctx2.rect(posX + arrowSize, posY - arrowSize / 2, arrowSize, arrowSize);
      ctx2.fill();
      break;
    case "up":
      // ctx2.clearRect(0, 0, canvas.width, canvas.height);
      $("#mainColumn").html(drawBoard());
      posY = posY - size * 1.2;
      posX = posX + size / 2;
      ctx2.moveTo(posX, posY);
      ctx2.lineTo(posX - arrowSize, posY + arrowSize);
      ctx2.lineTo(posX + arrowSize, posY + arrowSize);
      ctx2.fill();
      ctx2.rect(posX - arrowSize / 2, posY + arrowSize, arrowSize, arrowSize);
      ctx2.fill();
      break;
    case "down":
      // ctx2.clearRect(0, 0, canvas.width, canvas.height);
      $("#mainColumn").html(drawBoard());
      posY = posY + size / 4;
      posX = posX + size / 2;
      ctx2.moveTo(posX, posY);
      ctx2.lineTo(posX + arrowSize, posY - arrowSize);
      ctx2.lineTo(posX - arrowSize, posY - arrowSize);
      ctx2.fill();
      ctx2.rect(
        posX - arrowSize / 2,
        posY - arrowSize * 2,
        arrowSize,
        arrowSize
      );
      ctx2.fill();
      break;
  }
  ctx2.closePath();
});

function getCanvasPos(event) {
  var canvasRect = document.getElementById("Canvas").getBoundingClientRect();

  //Get relative position on canvas
  var xPos = event.clientX - canvasRect.left;
  var yPos = event.clientY - canvasRect.top;

  //Get coordinate
  var size = 600 / board.size;
  yPos = Math.floor(yPos / size) + 1;
  xPos = Math.floor(xPos / size);
  xPos = col_array[xPos];

  // console.log({ col: xPos, row: yPos});
  return xPos + yPos;
}

$(document).on("mousedown", "#Canvas", function (event) {
  // console.log("mousedown");
  mouseDownLocation = getCanvasPos(event);
  console.log("mousedown: " + mouseDownLocation);

  document.getElementById("inputBox").value = mouseDownLocation;
});

$(document).on("mouseup", "#Canvas", function (event) {
  // console.log("mouseup");
  mouseUpLocation = getCanvasPos(event);
  console.log("mouseUp: " + mouseUpLocation);
  clearMoves();
  $("#mainColumn").html(drawBoard());

  checkDrag();
});

$(document).on("mousemove", "#Canvas", function (event) {
  // console.log("mousemove");
});

$(document).on("mouseout", "#Canvas", function (event) {
  // console.log("mouseout");
});

function checkDrag() {
  var originCol = col_array.indexOf(mouseDownLocation.charAt(0));
  var destCol = col_array.indexOf(mouseUpLocation.charAt(0));
  var spliceSize = board.size > 9 ? 2 : 1;
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
function clearMoves() {
  document.getElementById("left").disabled = true;
  document.getElementById("right").disabled = true;
  document.getElementById("up").disabled = true;
  document.getElementById("down").disabled = true;
}

function load_img(imgToLoad) {
  let loaded = false;
  let counter = 0;
  for (let i = 0; i < imgToLoad.length; i++) {
    const img = new Image();
    img.onload = function () {
      counter++;
      if (counter == imgToLoad.length) {
        loaded = true;
      }
    };
    img.src = imgToLoad[i];
    img_array = img;
  }
}

function drawBoard() {
  load_img([
    "./graphics/github.png",
    "./graphics/react.png",
    "./graphics/javascript.png",
    "./graphics/nodejs.png",
    "./graphics/webpack.png",
    "./graphics/jquery.png",
  ]);

  const cellSize = 600 / board.size;

  var canvas = document.getElementById("Canvas");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.strokeRect(0,0, canvas.width, canvas.height);
  ctx.strokeStyle = "lightgrey";

  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const gem = board.gemAt(row, col);
      const image = document.getElementById(gem.letter);
      const dx = col * cellSize;
      const dy = row * cellSize;
      const dWidth = cellSize;
      const dHeight = cellSize;
      ctx.drawImage(image, dx, dy, dWidth, dHeight);
      ctx.strokeRect(dx, dy, dWidth, dHeight);
    }
  }
}
