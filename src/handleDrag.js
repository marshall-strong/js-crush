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

// let gameboardHasStreaks = false;
// initialize gameboardHasStreaks flag to true so that the do-while loop/crushStreaksOrUpdateUI runs immediately
let gameboardHasStreaks;

function flipAndDraw(firstGem, dir) {
  board.flipGems(firstGem, board.getGemInDirection(firstGem, dir));
  $("#mainColumn").html(game.drawBoard());
  document.getElementById("gameCanvas").style.pointerEvents = "none";
  document.getElementById("getHint").disabled = true;

  // crushStreaks();
  // const crushStreaksOrUpdateUI = setInterval(function () {
  //   if (gameboardHasStreaks == true) {
  //     crushStreaks();
  //   } else {
  //     clearInterval(crushStreaksOrUpdateUI);
  //     document.getElementById("gameCanvas").style.pointerEvents = "auto";
  //     document.getElementById("getHint").disabled = false;
  //   }
  // }, 1000);

  // continue to crush streaks (then adding gems) until no more streaks remain.
  do {
    crushStreaks();
  } while (gameboardHasStreaks);
  // update user interface
  document.getElementById("gameCanvas").style.pointerEvents = "auto";
  document.getElementById("getHint").disabled = false;
}

function crushStreaks() {
  const gemStreaks = game.getGemStreaks();
  var canvas = document.getElementById("gameCanvas");
  var cxt = canvas.getContext("2d");
  const cellSize = 600 / board.dimension;
  var alphaCounter = 10;
  // debugger
  if (gemStreaks.length != 0) {
    game.removeGemStreaks(gemStreaks);

    game.moveGemsDown();

    $("#mainColumn").html(game.drawBoard());

    // recalculate gemStreaks
    if (game.getGemStreaks().length == 0) {
      gameboardHasStreaks = false;
    } else {
      gameboardHasStreaks = true;
    }

    // const alpha = setInterval(function () {
    //   alphaCounter = alphaCounter - 1;
    //   cxt.globalAlpha = alphaCounter / 10;
    //   for (let i = 0; i < gemStreaks.length; i++) {
    //     for (let j = 0; j < gemStreaks[0].length; j++) {
    //       const letter = String(gemStreaks[i][j].letter);
    //       const scoreLetter = gemStreaks[i][j].letter;
    //       ctxt.clearRect(
    //         gemStreaks[i][j].col * cellSize,
    //         gemStreaks[i][j].row * cellSize,
    //         cellSize,
    //         cellSize
    //       );
    //       cxt.drawImage(
    //         document.getElementById(letter),
    //         gemStreaks[i][j].col * cellSize,
    //         gemStreaks[i][j].row * cellSize,
    //         cellSize,
    //         cellSize
    //       );
    //     }
    //   }
    //   changeScoreColor(scoreLetter);
    //   if (alphaCounter <= 0) {
    //     clearInterval(alpha);
    //     // console.log('alpha cleared');
    //   }
    // }, 50);
  }

  // setTimeout(function () {
  //   ctxt.globalAlpha = 1.0;

  //   game.removeGemStreaks(gemStreaks);

  //   game.moveGemsDown();

  //   $("#mainColumn").html(game.drawBoard());

  //   // recalculate gemStreaks
  //   if (game.getGemStreaks().length == 0) {
  //     gameboardHasStreaks = false;
  //   } else {
  //     gameboardHasStreaks = true;
  //   }
  // }, 550);
}
