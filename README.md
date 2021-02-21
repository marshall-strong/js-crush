# JS-Crush

Play the live version!
https://marshall-strong.github.io/js-crush/

html javascript css gem crush game

# code

## gem.js

`constructor(gemId, getCol, getRow)`

`col()`

`row()`

## board.js

`constructor(gridSize)`

`getCol(gemId)`

`getRow(gemId)`

`gem(col, row)`

`addNewGem(col, row)`

`updateGem(gem, newCol, newRow)`

`swapGems(gem1, gem2)`

`relativePosition(gem1, gem2)`

`removeGem(gem)`

`removeGems(gems)`

`adjacentGems(gem)`

`randomize()`

getMatches

`horizontalStreaks()`

`verticalStreaks()`

`findMatches()`

`getMatches()`

## game.js

`constructor(gameCanvas)`

`resetGame()`

### get move from player

`setMouseEventGem(mouseEvent)`

`checkMouseEvent()`

### handle move

`checkMove(gem1, gem2)`

### update score

`updateScore(matches)`

`clearScore()`

###

`findMatchesMade(gem1, gem2)`

`removeMatches(matches)`

`shiftGemsDown()`

`checkForMatches()`

`removeMatchesUntilStable()`

`checkForMoves()`

`getAllMatchingMoves()`

### hint / autoMove

`showRandomMove()`

`makeRandomMove()`

### game canvas - board

`drawGameboard()`

`shakeGameboard()`

`shuffleGameboard()`

### game canvas - gems

`highlightGem(gem)`

`swapGems(gem1, gem2)`

`hSwapGems(gem1, gem2, gem1Movement)`

`vSwapGems(gem1, gem2, gem1Movement)`

`fadeOutMatches(matches)`

## index.js

`themes`

`Math.seedrandom(0)`

```
  window.addEventListener("DOMContentLoaded", () => {
    $(document).on("click", #newGame)
    $(document).on("click", #getHint)
    $(document).on("click", #autoMove)
    $(document).on("click", #shuffleBoard)
    $(document).on("mousedown", #gameCanvas)
    $(document).on("mouseup", #gameCanvas)
  })
```
