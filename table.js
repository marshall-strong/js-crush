let img_array = [];

function lookupLetter(num) {
  const arrColLetters = [`a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`];
  return arrColLetters[--num];
}

function genBoardHtml() {
  const divClass = `class='p-2 align-self-center'`;
  const divStyle = `style='margin:-10px;'`
  const tableClass = `class='tableBorder'`;

  let htmlTable = `<div ${divClass} ${divStyle}><table ${tableClass}>`;

  for (let row = 0; row < DEFAULT_BOARD_SIZE; row++) {
    let htmlRow = `<tr class='tableBorder'>`;

    for (let col = 0; col < DEFAULT_BOARD_SIZE; col++) {
      const colLetter = lookupLetter(col+1);
      const bgColor =  board.getGemAt(row, col);
      let txtColor = `white`;
      if (bgColor == `yellow`) {
          txtColor = `#505050`;
      }

      const cellClass = `class='tableBorder padCell text-center'`;
      const cellStyle = `style='background-color:${bgColor};color:${txtColor}'`;
      const cellContents = `${colLetter}${row + 1}`;
      
      const htmlCell = `<td ${cellClass} ${cellStyle}>${cellContents}</td>`;
      htmlRow += htmlCell;
    }

    htmlRow += `</tr>`;   
    htmlTable += htmlRow; 
  }
  
  htmlTable += `</table></div>`;  
  return htmlTable;
};
