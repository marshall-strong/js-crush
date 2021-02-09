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

let mouseDownLocation;
let mouseUpLocation;

// Click and Drag functionality
$(document).on("mousedown", "#gameCanvas", function (event) {
  mouseDownLocation = game.getCanvasPos(event);
  console.log("mousedown: " + mouseDownLocation);
});
$(document).on("mouseup", "#gameCanvas", function (event) {
  mouseUpLocation = game.getCanvasPos(event);
  console.log("mouseUp: " + mouseUpLocation);
  $("#mainColumn").html(game.drawBoard());
  checkDrag();
});

function checkDrag() {
  const originCol = col_array.indexOf(mouseDownLocation.charAt(0));
  const destCol = col_array.indexOf(mouseUpLocation.charAt(0));
  const spliceSize = board.dimension > 9 ? 2 : 1;
  const originRow = mouseDownLocation.substr(1, spliceSize);
  const destRow = mouseUpLocation.substr(1, spliceSize);

  const inputCol = col_array.indexOf(mouseDownLocation.charAt(0));
  const inputRow =
    mouseDownLocation.length < 3
      ? Number(mouseDownLocation.charAt(1)) - 1
      : Number(mouseDownLocation.charAt(1) + mouseDownLocation.charAt(2)) - 1;
  const firstGem = board.gridCellGem(inputRow, inputCol);

  const availableMove = (dir) => {
    return game.isMoveTypeValid(firstGem, dir);
  };

  const checkMove = (dir) => {
    const canvas = document.getElementById("gameCanvas");
    const ctxt = canvas.getContext("2d");
    const gemTo = board.getGemInDirection(firstGem, dir);
    const cellSize = 600 / board.dimension;

    var clearWidth, clearHeight;

    var destRow, destCol, originRow, originCol;

    if (dir == "right" || dir == "left") {
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
          flipAndDraw(firstGem, dir);
        }
      }, 10);
    } else {
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
          flipAndDraw(firstGem, dir);
        }
      }, 10);
    }
  };

  if (originCol == destCol) {
    //moving up or down
    if (originRow < destRow) {
      if (availableMove("down")) {
        checkMove("down");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    } else {
      if (availableMove("up")) {
        checkMove("up");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    }
  } else {
    if (originCol < destCol) {
      if (availableMove("right")) {
        checkMove("right");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    } else {
      if (availableMove("left")) {
        checkMove("left");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    }
    //moving left or right
  }
}

////////////////////////////////////////////////////////
// everything below here is used in checkDrag

function flipAndDraw(firstGem, dir) {
  board.flipGems(firstGem, board.getGemInDirection(firstGem, dir));
  $("#mainColumn").html(game.drawBoard());
  document.getElementById("gameCanvas").style.pointerEvents = "none";
  document.getElementById("getHint").disabled = true;

  let streaks = game.getGemStreaks();
  while (streaks.length > 0) {
    game.removeGemStreaks(streaks);
    game.moveGemsDown();
    $("#mainColumn").html(game.drawBoard());
    streaks = game.getGemStreaks();
  }

  const remainingStreaks = game.getGemStreaks();
  if (remainingStreaks.length > 0) {
    console.log("error: there should not be any more streaks!!");
    debugger;
  } else {
    console.log("no remaining streaks");
    // update user interface
    document.getElementById("gameCanvas").style.pointerEvents = "auto";
    document.getElementById("getHint").disabled = false;
  }
}
