// // New Game button
// $(document).on("click", "#newGame", function (event) {
//   game.clearGameboard();
//   game.setupGameboard();
//   $("#mainColumn").html(game.drawBoard());
//   board.resetScore();
// });

// unused
$(document).on("mousemove", "#gameCanvas", function (event) {});
$(document).on("mouseout", "#gameCanvas", function (event) {});
$(document).on("keydown", function (event) {});
$(document).keypress(function (event) {});

// original
let mouseDownLocation;
let mouseUpLocation;
// new
let mouseDownColAndRow;
let mouseUpColAndRow;

// mouseEvent handlers
$(document).on("mousedown", "#gameCanvas", function (mouseDown) {
  // original
  mouseDownLocation = game.getCanvasPos(mouseDown);
  // console.log("mousedown: " + mouseDownLocation);

  // new
  mouseDownColAndRow = game.getGameboardColAndRow(mouseDown);
});

$(document).on("mouseup", "#gameCanvas", function (mouseUp) {
  // original
  mouseUpLocation = game.getCanvasPos(mouseUp);
  // console.log("mouseUp: " + mouseUpLocation);
  // $("#mainColumn").html(game.drawBoard());
  checkDrag();

  // new
  mouseUpColAndRow = game.getGameboardColAndRow(mouseUp);
  // defining this function inline for now...
  // define clickOrDrag
  function clickOrDrag(mouseDownCol, mouseDownRow, mouseUpCol, mouseUpRow) {
    const click = mouseDownCol === mouseUpCol && mouseDownRow === mouseUpRow;
    const mouseInput = click ? "click" : "drag";
    if (mouseInput === "click") {
      console.log("click");
    } else {
      console.log("drag");
    }
  }
  // call clickOrDrag with mouseDownColAndRow and mouseUpColAndRow
  clickOrDrag(
    mouseDownColAndRow.col,
    mouseDownColAndRow.row,
    mouseUpColAndRow.col,
    mouseUpColAndRow.row
  );
});

// original
function checkDrag() {
  const originCol = col_array.indexOf(mouseDownLocation.charAt(0));
  const destCol = col_array.indexOf(mouseUpLocation.charAt(0));
  const originRow = mouseDownLocation.substring(1);
  const destRow = mouseUpLocation.substring(1);

  const inputCol = col_array.indexOf(mouseDownLocation.charAt(0));
  const inputRow =
    mouseDownLocation.length < 3
      ? Number(mouseDownLocation.charAt(1)) - 1
      : Number(mouseDownLocation.charAt(1) + mouseDownLocation.charAt(2)) - 1;
  const firstGem = board.gridCellGem(inputRow, inputCol);

  const checkMove = (dir) => {
    const canvas = document.getElementById("gameCanvas");
    const ctxt = canvas.getContext("2d");
    const gemTo = board.getGemInDirection(firstGem, dir);
    const cellSize = 600 / board.dimension;

    var clearWidth, clearHeight;

    var destRow, destCol, originRow, originCol;

    // swap gems
    if (dir == "right" || dir == "left") {
      // horizontal swap
      clearWidth = cellSize * 2;
      clearHeight = cellSize;
      var originLetter, destLetter;
      if (firstGem.col > gemTo.col) {
        destCol = firstGem.col * cellSize;
        originCol = gemTo.col * cellSize;
        originLetter = gemTo.letter;
        destLetter = firstGem.letter;
      } else {
        destCol = gemTo.col * cellSize;
        originCol = firstGem.col * cellSize;
        originLetter = firstGem.letter;
        destLetter = gemTo.letter;
      }
      destRow = gemTo.row * cellSize;
      originRow = firstGem.row * cellSize;
      var timer = 0;

      // TimingEvent
      // horizontal swap animation
      const horizontalSwap = setInterval(function () {
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
          clearInterval(horizontalSwap);
          flipAndDraw(firstGem, dir);
        }
      }, 10);
    } else {
      // vertical swap
      clearWidth = cellSize;
      clearHeight = cellSize * 2;
      if (firstGem.row > gemTo.row) {
        destRow = firstGem.row * cellSize;
        originRow = gemTo.row * cellSize;
        originLetter = gemTo.letter;
        destLetter = firstGem.letter;
      } else {
        destRow = gemTo.row * cellSize;
        originRow = firstGem.row * cellSize;
        originLetter = firstGem.letter;
        destLetter = gemTo.letter;
      }
      destCol = gemTo.col * cellSize;
      originCol = firstGem.col * cellSize;
      var timer = 0;

      // TimingEvent
      // vertical swap animation
      const verticalSwap = setInterval(function () {
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
          clearInterval(verticalSwap);
          flipAndDraw(firstGem, dir);
        }
      }, 10);
    }
  };

  // check validity of move, then set the visibility of the "invalid" message
  if (originCol == destCol) {
    // moving up or down
    if (originRow < destRow) {
      if (game.isMoveTypeValid(firstGem, "down")) {
        checkMove("down");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    } else {
      if (game.isMoveTypeValid(firstGem, "up")) {
        checkMove("up");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    }
  } else {
    // moving left or right
    if (originCol < destCol) {
      if (game.isMoveTypeValid(firstGem, "right")) {
        checkMove("right");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    } else {
      if (game.isMoveTypeValid(firstGem, "left")) {
        checkMove("left");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    }
  }
}

////////////////////////////////////////////////////////
// everything below here is used in checkDrag

let continueCrushing;

function flipAndDraw(firstGem, dir) {
  board.flipGems(firstGem, board.getGemInDirection(firstGem, dir));
  $("#mainColumn").html(game.drawBoard());
  document.getElementById("gameCanvas").style.pointerEvents = "none";
  document.getElementById("getHint").disabled = true;

  crushStreaks();

  // TimingEvent
  const gg = setInterval(function () {
    if (continueCrushing == true) {
      crushStreaks();
    } else {
      clearInterval(gg);
      document.getElementById("gameCanvas").style.pointerEvents = "auto";
      document.getElementById("getHint").disabled = false;
    }
  }, 1000);
}

function crushStreaks() {
  const listRemove = game.getGemStreaks();
  const canvas = document.getElementById("gameCanvas");
  const ctxt = canvas.getContext("2d");
  const cellSize = 600 / board.dimension;
  if (listRemove.length != 0) {
    // TimingEvent
    let alphaCounter = 10;
    const fadeOut = setInterval(function () {
      // alphaCounter = alphaCounter - 1;
      ctxt.globalAlpha = --alphaCounter / 10;
      for (var i = 0; i < listRemove.length; i++) {
        for (var j = 0; j < listRemove[0].length; j++) {
          var letter = String(listRemove[i][j].letter);
          var scoreLetter = listRemove[i][j].letter;
          // debugger;
          ctxt.clearRect(
            listRemove[i][j].col * cellSize,
            listRemove[i][j].row * cellSize,
            cellSize,
            cellSize
          );
          ctxt.drawImage(
            document.getElementById(letter),
            listRemove[i][j].col * cellSize,
            listRemove[i][j].row * cellSize,
            cellSize,
            cellSize
          );
        }
      }
      // game.gameboard.updateScoreColor(scoreLetter);
      if (alphaCounter <= 0) {
        clearInterval(fadeOut);
        // console.log('alpha cleared');
      }
    }, 50);
  }

  // pause after gems fade out, before moving gems down ??
  // after swapping gems, pause before removing them ??
  // TimingEvent
  setTimeout(function () {
    // debugger;
    ctxt.globalAlpha = 1.0;

    game.removeGemStreaks(listRemove);

    game.moveGemsDown();

    $("#mainColumn").html(game.drawBoard());

    const newListRemove = game.getGemStreaks();

    if (newListRemove.length == 0) {
      continueCrushing = false;
    } else {
      continueCrushing = true;
    }
  }, 550);
}

// need to add an animation for moving gems down!!
