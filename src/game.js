// Seed RNG to generate initial board
Math.seedrandom(0);

// A short jQuery extension to read query parameters from the URL.
$.extend({
  getUrlVars: function () {
    let vars = [],
      pair;
    const pairs = window.location.search.substr(1).split("&");
    for (let i = 0; i < pairs.length; i++) {
      pair = pairs[i].split("=");
      vars.push(pair[0]);
      vars[pair[0]] =
        pair[1] && decodeURIComponent(pair[1].replace(/\+/g, " "));
    }
    return vars;
  },
  getUrlVar: function (name) {
    return $.getUrlVars()[name];
  },
});

// constants
const DEFAULT_BOARD_SIZE = 8;

// data model at global scope for easier debugging
const col_array = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
let board;
var rules;
var inputBoxInfo;
var validInput = false;
var image_array;
var BOARD_SIZE;
var globalCrushCounter = true;
var mouseDownLocation;
var mouseUpLocation;

// initialize board
if ($.getUrlVar("size") && $.getUrlVar("size") >= 3) {
  board = new Board($.getUrlVar("size"));
  BOARD_SIZE = $.getUrlVar("size");
} else {
  board = new Board(DEFAULT_BOARD_SIZE);
  BOARD_SIZE = DEFAULT_BOARD_SIZE;
}

rules = new Rules(board);

// move a gem on the board
$(board).on("scoreUpdate", function (e, info) {
  $("#score").html(board.getScore());
});

// keyboard events arrive here
$(document).on("keydown", function (event) {
  // Your code here.
});

// Button Events
$(document).on("click", "#newGame", function (event) {
  rules.cleanBoard();
  rules.prepareNewGame();
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
  var currGem = board.getGemAt(inputRow, inputCol);
  var bool = rules.isMoveTypeValid(currGem, dir);
  return bool;
}

/* Add basic behaivor to gameplay
 * because this game is stupid
 */
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
  var currGem = board.getGemAt(inputRow, inputCol);
  var bool = rules.isMoveTypeValid(currGem, dir);
  var canvas = document.getElementById("Canvas");
  ctxt = canvas.getContext("2d");
  var gemTo = board.getGemInDirection(currGem, dir);
  var size = 320 / board.getSize();

  var clearWidth, clearHeight;

  var destRow, destCol, originRow, originCol;

  if (dir == "right" || dir == "left") {
    clearWidth = size * 2;
    clearHeight = size;
    var originColor, destColor;
    if (currGem.col > gemTo.col) {
      destCol = currGem.col * size;
      originCol = gemTo.col * size;
      originColor = gemTo.color;
      destColor = currGem.color;
    } else {
      destCol = gemTo.col * size;
      originCol = currGem.col * size;
      originColor = currGem.color;
      destColor = gemTo.color;
    }
    destRow = gemTo.row * size;
    originRow = currGem.row * size;
    var timer = 0;

    var inter = setInterval(function () {
      // console.log('switching here');
      ctxt.clearRect(originCol, originRow, clearWidth, clearHeight);

      ctxt.drawImage(
        document.getElementById(originColor + "-gem"),
        originCol + (timer * size) / 20,
        originRow,
        size,
        size
      );
      ctxt.drawImage(
        document.getElementById(destColor + "-gem"),
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
      originColor = gemTo.color;
      destColor = currGem.color;
    } else {
      destRow = gemTo.row * size;
      originRow = currGem.row * size;
      originColor = currGem.color;
      destColor = gemTo.color;
    }
    destCol = gemTo.col * size;
    originCol = currGem.col * size;
    var timer = 0;

    var inter = setInterval(function () {
      ctxt.clearRect(originCol, originRow, clearWidth, clearHeight);

      ctxt.drawImage(
        document.getElementById(originColor + "-gem"),
        originCol,
        originRow + (timer * size) / 20,
        size,
        size
      );
      ctxt.drawImage(
        document.getElementById(destColor + "-gem"),
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
  document.getElementById("helpBtn").disabled = true;

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
      document.getElementById("helpBtn").disabled = false;
    }
  }, 1100);
}

function crushcrush() {
  var listRemove = rules.getGemCrushes();
  var canvas = document.getElementById("Canvas");
  var cxt = canvas.getContext("2d");
  var size = 320 / board.getSize();
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
          var color = String(listRemove[i][j].color) + "-gem";
          var scoreColor = listRemove[i][j].color;
          ctx.clearRect(
            listRemove[i][j].col * size,
            listRemove[i][j].row * size,
            size,
            size
          );
          cxt.drawImage(
            document.getElementById(color),
            listRemove[i][j].col * size,
            listRemove[i][j].row * size,
            size,
            size
          );
        }
      }
      changeColor(scoreColor);
      if (alphaCounter <= 0) {
        clearInterval(alpha);
        // console.log('alpha cleared');
      }
    }, 50);
  }

  setTimeout(function () {
    ctx.globalAlpha = 1.0;
    rules.removeCrushes(listRemove);

    $("#mainColumn").html(drawBoard());
    rules.moveGemsDown();

    $("#mainColumn").html(drawBoard());

    listRemove = rules.getGemCrushes();
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

function changeColor(gem) {
  var colorChange = "style=background-color:" + gem;
  switch (colorChange) {
    case "style=background-color:red":
      document.getElementById("score").style.backgroundColor = "red";
      break;
    case "style=background-color:green":
      document.getElementById("score").style.backgroundColor = "green";
      break;
    case "style=background-color:blue":
      document.getElementById("score").style.backgroundColor = "blue";
      break;
    case "style=background-color:orange":
      document.getElementById("score").style.backgroundColor = "orange";
      break;
    case "style=background-color:purple":
      document.getElementById("score").style.backgroundColor = "purple";
      break;
    case "style=background-color:yellow":
      document.getElementById("score").style.backgroundColor = "yellow";
      break;
  }
}

function drawGem(row, col, size, color) {
  switch (color) {
    case "red":
      ctx.drawImage(
        document.getElementById("red-gem"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
    case "green":
      ctx.drawImage(
        document.getElementById("green-gem"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
    case "blue":
      ctx.drawImage(
        document.getElementById("blue-gem"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
    case "orange":
      ctx.drawImage(
        document.getElementById("orange-gem"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
    case "purple":
      ctx.drawImage(
        document.getElementById("purple-gem"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
    case "yellow":
      ctx.drawImage(
        document.getElementById("yellow-gem"),
        col * size,
        row * size,
        gemWidth,
        gemHeight
      );
      ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
      break;
  }
}

$(document).on("click", "#helpBtn", function (event) {
  var helpMove = rules.getRandomValidMove();
  // console.log(helpMove.gem);
  // console.log(helpMove.direction);
  var size = 320 / board.getSize();
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
  var size = 320 / BOARD_SIZE;
  yPos = Math.floor(yPos / size) + 1;
  xPos = Math.floor(xPos / size);
  xPos = col_array[xPos];

  // console.log({ col: xPos, row: yPos});
  return xPos + yPos;
}

$(document).on("mousedown", "#Canvas", function (event) {
  console.log("mousedown");
  mouseDownLocation = getCanvasPos(event);
  console.log("mousedown: " + mouseDownLocation);

  document.getElementById("inputBox").value = mouseDownLocation;
});

$(document).on("mouseup", "#Canvas", function (event) {
  console.log("mouseup");
  mouseUpLocation = getCanvasPos(event);
  console.log("mouseUp: " + mouseUpLocation);
  clearMoves();
  $("#mainColumn").html(drawBoard());

  checkDrag();
});

$(document).on("mousemove", "#Canvas", function (event) {
  console.log("mousemove");
});

$(document).on("mouseout", "#Canvas", function (event) {
  console.log("mouseout");
});

function checkDrag() {
  var originCol = col_array.indexOf(mouseDownLocation.charAt(0));
  var destCol = col_array.indexOf(mouseUpLocation.charAt(0));
  var spliceSize = BOARD_SIZE > 9 ? 2 : 1;
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

  var size = 320 / board.getSize();
  var gemHeight = size;
  var gemWidth = size;

  var canvas = document.getElementById("Canvas");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.strokeRect(0,0, canvas.width, canvas.height);
  ctx.strokeStyle = "lightgrey";

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      var bgColor = board.getGemAt(row, col);
      var color = "style=background-color:" + bgColor;

      switch (color) {
        case "style=background-color:red":
          // ctx.globalAlpha = .5;
          ctx.drawImage(
            document.getElementById("red-gem"),
            col * size,
            row * size,
            gemWidth,
            gemHeight
          );
          ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
          // ctx.globalAlpha = 1.0;
          break;
        case "style=background-color:green":
          ctx.drawImage(
            document.getElementById("green-gem"),
            col * size,
            row * size,
            gemWidth,
            gemHeight
          );
          ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
          break;
        case "style=background-color:blue":
          ctx.drawImage(
            document.getElementById("blue-gem"),
            col * size,
            row * size,
            gemWidth,
            gemHeight
          );
          ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
          break;
        case "style=background-color:orange":
          ctx.drawImage(
            document.getElementById("orange-gem"),
            col * size,
            row * size,
            gemWidth,
            gemHeight
          );
          ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
          break;
        case "style=background-color:purple":
          ctx.drawImage(
            document.getElementById("purple-gem"),
            col * size,
            row * size,
            gemWidth,
            gemHeight
          );
          ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
          break;
        case "style=background-color:yellow":
          ctx.drawImage(
            document.getElementById("yellow-gem"),
            col * size,
            row * size,
            gemWidth,
            gemHeight
          );
          ctx.strokeRect(col * size, row * size, gemWidth, gemHeight);
          break;
      }
    }
  }
  // const canvas2 = document.getElementById("gemCanvas1");
  // cntxt = canvas2.getContext("2d");
  // cntxt.fillRect(0, 0, 200, 200);
}