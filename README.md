# JS-Crush

Play the live version!
https://marshall-strong.github.io/js-crush/

html javascript css gem crush game

Description:
jsCrush is classic match-three puzzle game, created using vanilla JavaScript.

Goal:
For this project, my goal was to create a browser game without using any additional libraries.

Decisions/Implementation:

Technology:

Features:

Challenges:

Todos:
https://boxy-svg.com/
https://devicon.dev/
https://www.svgbackgrounds.com/#tortoise-shell
https://www.svgbackgrounds.com/#flat-mountains

# code

## gem.js

- `constructor(gemId, getCol, getRow)`
- `col()`
- `row()`

## board.js

- `constructor(gridSize)`

- `getCol(gemId)`
- `getRow(gemId)`
- `gem(col, row)`

- `addNewGem(col, row)`

- `updateGem(gem, newCol, newRow)`

- `swapGems(gem1, gem2)`

- `relativePosition(gem1, gem2)`

- `removeGem(gem)`
- `removeGems(gems)`

- `adjacentGems(gem)`

- `randomize()`

- `horizontalStreaks()`
- `verticalStreaks()`
- `findMatches()`
- `getMatches()`

## game.js

- `constructor(gameCanvas)`

- `resetGame()`

- `setMouseEventGem(mouseEvent)`
- `checkMouseEvent()`

- `findMatchesMade(gem1, gem2)`
- `checkMove(gem1, gem2)`

- `removeMatches(matches)`
- `shiftGemsDown()`
- `checkBoardForMatches()`
- `removeMatchesTilBoardIsStable()`
- `getMatchingMoves()`
- `ensureMatchingMovesExist()`
- `shuffleGameboard()`

- `updateScore(matches)`
- `clearScore()`

- `showRandomMove()`
- `makeRandomMove()`

- `drawGameboard()`
- `shakeGameboard()`
- `highlightGem(gem)`
- `swapGems(gem1, gem2)`
- `hSwapGems(gem1, gem2, gem1Movement)`
- `vSwapGems(gem1, gem2, gem1Movement)`
- `fadeOutMatches(matches)`

## index.js

`themes`

`Math.seedrandom(0)`

https://tobiasahlin.com/blog/move-from-jquery-to-vanilla-javascript/#selecting-elements
