// // Helper Method for game.getGemStreaks
// // Returns a set of sets of all the same-letter gem strips of length at least 3 on the board.
// // If 'vertical' is set to true, only look for vertical strips.
// // Otherwise, only look for horizontal strips.
// // If the 'swap' array is passed, then every even-indexed gem in the array is considered swapped with every odd-indexed gem in the array.
// this.findHorizontalStreaks = function (swap) {
//   const getGemAt = (row, col) => {
//     // Retrieve the gem at a row and column (depending on vertical)
//     const theGem = board.gridCellGem(row, col);
//     if (swap) {
//       // If theGem is one of the two gems in the `swap`, return the other gem.
//       let index = swap.indexOf(gem);
//       if (index >= 0) {
//         return swap[index ^ 1];
//       }
//     }
//     return theGem;
//   };

//   const streaks = [];

//   // iterate through each row
//   for (let row = 0; row < board.dimension; row++) {
//     for (let nextCol, col = 0; col < board.dimension; col = nextCol) {
//       // Scan row for matches, starting at col
//       const gem = getGemAt(row, col);
//       nextCol = col + 1;
//       if (!gem) continue;
//       let matches = [gem];
//       while (nextCol < board.dimension) {
//         const nextGem = getGemAt(row, nextCol);
//         if (!nextGem || nextGem.letter != gem.letter) break;
//         matches.push(nextGem);
//         nextCol++;
//       }
//       // If there are at least 3 gems in the match, add it to streaks.
//       if (matches.length >= 3) streaks.push(matches);
//     }
//   }

//   return streaks;
// };
