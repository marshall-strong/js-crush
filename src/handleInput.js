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
    // handleFirstClicks
    handleFirstClick();
    firstClick = { col: col, row: row };
  } else {
    // handleSecondClick
    const secondClick = { col: col, row: row };
    const adjacent = board.adjacentSquares(firstClick.col, firstClick.row);
    let isLegalMove = false;
    // iterate through adjacent moves --
    // if any have same col & row as secondClick, isLegalMove = false
    for (let i = 0; i < adjacent.length; i++) {
      const sameCol = adjacent[i].col === secondClick.col;
      const sameRow = adjacent[i].row === secondClick.row;
      if (sameCol && sameRow) isLegalMove = true;
    }
    // get the gems
    const firstGem = board.gemAtSquare(firstClick.col, firstClick.row);
    const secondGem = board.gemAtSquare(secondClick.col, secondClick.row);
    // handleIllegalMoves
    if (!isLegalMove) handleIllegalMove(firstGem, secondGem);
    // handleLegalMoves
    if (isLegalMove) {
      // check if swapping the gems creates any matches
      const matchesMadeByMove = game.findMatchesMadeBySwap(firstGem, secondGem);
      // handleMatchingMoves
      if (matchesMadeByMove.length > 0) {
        handleLegalMove(firstGem, secondGem);
        handleMatchingMove(firstGem, secondGem);
      }
      // handleNonMatchingMoves
      if (matchesMadeByMove.length === 0) {
        handleLegalMove(firstGem, secondGem);
        handleNonMatchingMove(firstGem, secondGem);
      }
    }

    setTimeout(() => {
      // reset
      game.drawBoard();
      firstClick = null;
    }, 550);
  }
}

// refactored version of checkMove
function animateSwap(gem1, gem2) {
  const canvas = document.getElementById("gameCanvas");
  const ctxt = canvas.getContext("2d");
  const squareLength = 600 / board.dimension;

  // direction describes gem2 relative to gem1
  let direction;
  const dx = gem2.col - gem1.col;
  const dy = gem2.row - gem1.row;
  if (dx === 1 && dy === 0) direction = "right";
  if (dx === 0 && dy === 1) direction = "down";
  if (dx === -1 && dy === 0) direction = "left";
  if (dx === 0 && dy === -1) direction = "up";
  console.log(direction);

  // ctxt.clearRect(rectX, rectY, rectWidth, rectHeight)
  // rectX and rectY use the left/top gem
  let rectX, rectY, rectWidth, rectHeight;

  // ctxt.drawImage
  let gem1Animation, gem2Animation;

  // animations for moving in each direction
  const moveRightAnimation = (gem, timer) =>
    ctxt.drawImage(
      document.getElementById(gem.letter),
      gem.col * squareLength + (timer * squareLength) / 20,
      gem.row * squareLength,
      squareLength,
      squareLength
    );

  const moveDownAnimation = (gem, timer) =>
    ctxt.drawImage(
      document.getElementById(gem.letter),
      gem.col * squareLength,
      gem.row * squareLength + (timer * squareLength) / 20,
      squareLength,
      squareLength
    );

  const moveLeftAnimation = (gem, timer) =>
    ctxt.drawImage(
      document.getElementById(gem.letter),
      gem.col * squareLength - (timer * squareLength) / 20,
      gem.row * squareLength,
      squareLength,
      squareLength
    );

  const moveUpAnimation = (gem, timer) =>
    ctxt.drawImage(
      document.getElementById(gem.letter),
      gem.col * squareLength,
      gem.row * squareLength - (timer * squareLength) / 20,
      squareLength,
      squareLength
    );

  // run animation
  let timer = 0;
  const animation = setInterval(function () {
    // set animation parameters based on direction
    // direction describes gem2's initial position relative to gem1's initial position
    // (it is also the direction that gem1 will move in)
    if (direction === "right") {
      rectX = gem1.col * squareLength;
      rectY = gem1.row * squareLength;
      rectWidth = 2 * squareLength;
      rectHeight = squareLength;
      gem1Animation = moveRightAnimation;
      gem2Animation = moveLeftAnimation;
    } else if (direction === "down") {
      rectX = gem1.col * squareLength;
      rectY = gem1.row * squareLength;
      rectWidth = squareLength;
      rectHeight = 2 * squareLength;
      gem1Animation = moveDownAnimation;
      gem2Animation = moveUpAnimation;
    } else if (direction === "left") {
      rectX = gem2.col * squareLength;
      rectY = gem2.row * squareLength;
      rectWidth = 2 * squareLength;
      rectHeight = squareLength;
      gem1Animation = moveLeftAnimation;
      gem2Animation = moveRightAnimation;
    } else if (direction === "up") {
      rectX = gem2.col * squareLength;
      rectY = gem2.row * squareLength;
      rectWidth = squareLength;
      rectHeight = 2 * squareLength;
      gem1Animation = moveUpAnimation;
      gem2Animation = moveDownAnimation;
    }

    // erase the swapping squares
    ctxt.clearRect(rectX, rectY, rectWidth, rectHeight);
    // draw gem1 in updated position
    gem1Animation(gem1, timer);
    // draw gem2 in updated position
    gem2Animation(gem2, timer);
    // increment timer
    timer++;
    // exit once animation has run 21 times
    if (timer > 20) {
      clearInterval(animation);
      // flipAndDraw
    }
  }, 10);
}

function handleFirstClick() {
  console.log("that was your first click...");
}
function handleIllegalMove(gem1, gem2) {
  console.log("...that move is not allowed.");
}
function handleLegalMove(gem1, gem2) {
  console.log("...that move is allowed!");
  animateSwap(gem1, gem2);
}
function handleMatchingMove(gem1, gem2) {
  console.log("...that move will match!");
  // Go delete the gems
}
function handleNonMatchingMove(gem1, gem2) {
  console.log("...that move will not match.");
  // Move the gems back
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

      // TimingEvent
      let timer = 0;
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
