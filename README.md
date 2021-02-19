# JS-Crush

Play the live version!
https://marshall-strong.github.io/js-crush/

html javascript css gem crush game

// gem.js
constructor(gemId, getCol, getRow)
col()
row()

// board.js
constructor(gridSize)
getCol(gemId)
getRow(gemId)
gem(col, row)
addNewGem(col, row)
updateGem(gem, newCol, newRow)
swapGems(gem1, gem2)
relativePosition(gem1, gem2)
removeGem(gem)
removeGems(gems)
adjacent(gem)
randomize()

// game.js
constructor(gameCanvas)

    reset()

    getMouseEventGem(mouseEvent)
    checkMouseEvent()
    handleClick()
    handleDrag()

    checkMove(gem1, gem2)
    handleNonAdjacentMove(gem1, gem2)
    handleNonMatchingMove(gem1, gem2)
    handleMatchingMove(gem1, gem2)


    updateScore(matches)
    clearScore()

Game.findMatches(gameboard)

    findMatchesMade(gem1, gem2)
    fadeOutMatches(matches)
    removeMatches(matches)
    shiftColDown(col, rowInitial)
    gravity()
    checkForMatches()
    removeMatchesUntilStable()
    autoMove()
    shuffle()

    drawGameboard()
    highlight(gem)
    swap(gem1, gem2)
    clearHorizontal(gem1, gem2, gem1Movement)
    clearVertical(gem1, gem2, gem1Movement)
    horizontalSwap(gem1, gem2, gem1Movement)
    verticalSwap(gem1, gem2, gem1Movement)
    shake()

// index.js
themes
Math.seedrandom(0)
window.addEventListener("DOMContentLoaded", () => {
$(document).on("click", #newGame)
$(document).on("click", #getHint)
$(document).on("click", #autoMove)
$(document).on("click", #shuffleBoard)
$(document).on("mousedown", #gameCanvas)
$(document).on("mouseup", #gameCanvas)
})
