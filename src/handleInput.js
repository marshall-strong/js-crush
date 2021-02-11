let mouseDownColAndRow;
let mouseUpColAndRow;

// define clickOrDrag
function clickOrDrag(mouseDownCol, mouseDownRow, mouseUpCol, mouseUpRow) {
  const click = mouseDownCol === mouseUpCol && mouseDownRow === mouseUpRow;
  const mouseInput = click ? "click" : "drag";
  if (mouseInput === "click") {
    console.log("click");
    handleClick(mouseDownCol, mouseDownRow);
  } else {
    console.log("drag");
    handleDrag(mouseDownCol, mouseDownRow, mouseUpCol, mouseUpRow);
  }
}

// mouseEvent handlers
$(document).on("mousedown", "#gameCanvas", function (mouseDown) {
  mouseDownColAndRow = game.getGameboardColAndRow(mouseDown);
});

$(document).on("mouseup", "#gameCanvas", function (mouseUp) {
  mouseUpColAndRow = game.getGameboardColAndRow(mouseUp);
  clickOrDrag(
    mouseDownColAndRow.col,
    mouseDownColAndRow.row,
    mouseUpColAndRow.col,
    mouseUpColAndRow.row
  );
});

let firstClick;
function handleClick(col, row) {
  // const clickedGem = board.gemAtSquare(col, row);
  const canvas = document.getElementById("gameCanvas");
  const ctxt = canvas.getContext("2d");
  const squareLength = 600 / board.dimension;
  const squareX = col * squareLength;
  const squareY = row * squareLength;

  ctxt.globalAlpha = 0.3;
  ctxt.fillStyle = "yellow";
  ctxt.fillRect(squareX, squareY, squareLength, squareLength);
  ctxt.globalAlpha = 1.0;

  if (!firstClick) {
    handleFirstClick();
    firstClick = { col: col, row: row };
  } else {
    const secondClick = { col: col, row: row };
    const adjacent = board.adjacentSquares(firstClick.col, firstClick.row);

    let isLegalMove = false;
    for (let i = 0; i < adjacent.length; i++) {
      const sameCol = adjacent[i].col === secondClick.col;
      const sameRow = adjacent[i].row === secondClick.row;
      if (sameCol && sameRow) isLegalMove = true;
    }

    if (!isLegalMove) handleIllegalMove();
    if (isLegalMove) {
      // get the gems
      const firstGem = board.gemAtSquare(firstClick.col, firstClick.row);
      const secondGem = board.gemAtSquare(secondClick.col, secondClick.row);
      // check if swapping the gems creates any matches
      const matchesMadeByMove = game.findMatchesMadeBySwap(firstGem, secondGem);
      if (matchesMadeByMove.length > 0) {
        handleMatchingMove();
      } else {
        handleNonMatchingMove();
      }
    }

    setTimeout(() => {
      // reset
      game.drawBoard();
      firstClick = null;
    }, 550);
  }
}

function handleFirstClick() {
  console.log("that was your first click...");
}
function handleMatchingMove() {
  console.log("...that move will match!");
}
function handleNonMatchingMove() {
  console.log("...that move will not match.");
}
function handleLegalMove() {
  console.log("...that move is allowed!");
}
function handleIllegalMove() {
  console.log("...that move is not allowed.");
}

function handleDrag(mouseDownCol, mouseDownRow, mouseUpCol, mouseUpRow) {
  const gemOne = board.gemAtSquare(mouseDownCol, mouseDownRow);
  const gemTwo = board.gemAtSquare(mouseUpCol, mouseUpRow);

  const checkMove = (dir) => {
    const canvas = document.getElementById("gameCanvas");
    const ctxt = canvas.getContext("2d");
    const gemTo = board.getGemInDirection(gemOne, dir);
    const squareLength = 600 / board.dimension;

    let clearWidth, clearHeight;

    let destRow, destCol, originRow, originCol;

    // swap gems
    if (dir == "right" || dir == "left") {
      // horizontal swap
      clearWidth = squareLength * 2;
      clearHeight = squareLength;
      let originLetter, destLetter;
      if (gemOne.col > gemTo.col) {
        destCol = gemOne.col * squareLength;
        originCol = gemTo.col * squareLength;
        originLetter = gemTo.letter;
        destLetter = gemOne.letter;
      } else {
        destCol = gemTo.col * squareLength;
        originCol = gemOne.col * squareLength;
        originLetter = gemOne.letter;
        destLetter = gemTo.letter;
      }
      destRow = gemTo.row * squareLength;
      originRow = gemOne.row * squareLength;
      let timer = 0;

      // TimingEvent
      // horizontal swap animation
      const horizontalSwap = setInterval(function () {
        ctxt.clearRect(originCol, originRow, clearWidth, clearHeight);

        ctxt.drawImage(
          document.getElementById(originLetter),
          originCol + (timer * squareLength) / 20,
          originRow,
          squareLength,
          squareLength
        );
        ctxt.drawImage(
          document.getElementById(destLetter),
          destCol - (timer * squareLength) / 20,
          destRow,
          squareLength,
          squareLength
        );

        timer++;
        // console.log(timer);
        if (timer == 21) {
          clearInterval(horizontalSwap);
          flipAndDraw(gemOne, dir);
        }
      }, 10);
    } else {
      // vertical swap
      clearWidth = squareLength;
      clearHeight = squareLength * 2;
      if (gemOne.row > gemTo.row) {
        destRow = gemOne.row * squareLength;
        originRow = gemTo.row * squareLength;
        originLetter = gemTo.letter;
        destLetter = gemOne.letter;
      } else {
        destRow = gemTo.row * squareLength;
        originRow = gemOne.row * squareLength;
        originLetter = gemOne.letter;
        destLetter = gemTo.letter;
      }
      destCol = gemTo.col * squareLength;
      originCol = gemOne.col * squareLength;
      let timer = 0;

      // TimingEvent
      // vertical swap animation
      const verticalSwap = setInterval(function () {
        // erase the two squares involved in the move
        ctxt.clearRect(originCol, originRow, clearWidth, clearHeight);

        ctxt.drawImage(
          document.getElementById(originLetter),
          originCol,
          originRow + (timer * squareLength) / 20,
          squareLength,
          squareLength
        );

        ctxt.drawImage(
          document.getElementById(destLetter),
          destCol,
          destRow - (timer * squareLength) / 20,
          squareLength,
          squareLength
        );

        timer++;

        // console.log(timer);
        if (timer == 21) {
          clearInterval(verticalSwap);
          flipAndDraw(gemOne, dir);
        }
      }, 10);
    }
  };

  // check validity of move, then set the visibility of the "invalid" message
  if (mouseDownCol == mouseUpCol) {
    if (mouseDownRow < mouseUpRow) {
      // DOWN
      if (game.getGemsToCrushGivenMove(gemOne, "down").length > 0) {
        checkMove("down");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    } else {
      // UP
      if (game.getGemsToCrushGivenMove(gemOne, "up").length > 0) {
        checkMove("up");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    }
  } else {
    if (mouseDownCol < mouseUpCol) {
      // RIGHT
      if (game.getGemsToCrushGivenMove(gemOne, "right").length > 0) {
        checkMove("right");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    } else {
      // LEFT
      if (game.getGemsToCrushGivenMove(gemOne, "left").length > 0) {
        checkMove("left");
        document.getElementById("invalid").style.visibility = "hidden";
      } else document.getElementById("invalid").style.visibility = "visible";
    }
  }
}

////////////////////////////////////////////////////////
// everything below here is used in handleDrag

let matchesExist;

function flipAndDraw(gemOne, dir) {
  board.flipGems(gemOne, board.getGemInDirection(gemOne, dir));
  $("#mainColumn").html(game.drawBoard());
  document.getElementById("gameCanvas").style.pointerEvents = "none";
  document.getElementById("getHint").disabled = true;

  removeMatches();

  // TimingEvent
  const gg = setInterval(function () {
    if (matchesExist) {
      removeMatches();
    } else {
      clearInterval(gg);
      document.getElementById("gameCanvas").style.pointerEvents = "auto";
      document.getElementById("getHint").disabled = false;
    }
  }, 1000);
}

function removeMatches() {
  const listRemove = game.findMatches();
  const canvas = document.getElementById("gameCanvas");
  const ctxt = canvas.getContext("2d");
  const squareLength = 600 / board.dimension;
  if (listRemove.length != 0) {
    // TimingEvent
    let alphaCounter = 10;
    const fadeOut = setInterval(function () {
      // alphaCounter = alphaCounter - 1;
      ctxt.globalAlpha = --alphaCounter / 10;
      for (let i = 0; i < listRemove.length; i++) {
        for (let j = 0; j < listRemove[i].length; j++) {
          const letter = String(listRemove[i][j].letter);
          // debugger;
          ctxt.clearRect(
            listRemove[i][j].col * squareLength,
            listRemove[i][j].row * squareLength,
            squareLength,
            squareLength
          );
          ctxt.drawImage(
            document.getElementById(letter),
            listRemove[i][j].col * squareLength,
            listRemove[i][j].row * squareLength,
            squareLength,
            squareLength
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
  // TimingEvent
  setTimeout(function () {
    // delete the (now 100% transparent) gems from the gameboard state
    game.removeMatchesFromBoard(listRemove);
    // reset transparency to 0%
    ctxt.globalAlpha = 1.0;
    // update the gameboard state by adding new gems and moving all gems down
    game.moveGemsDown();
    // redraw the board in its updated state (no animation yet for moving down)
    $("#mainColumn").html(game.drawBoard());
    // check if any new streaks now exist
    const newMatches = game.findMatches();
    matchesExist = newMatches.length > 0 ? true : false;
  }, 550);
}

// need to add an animation for moving gems down!!
