function changeScoreColor(gemLetter) {
  switch (gemLetter) {
    case "gemA":
      document.getElementById("score").style.backgroundColor = "red";
      break;
    case "gemB":
      document.getElementById("score").style.backgroundColor = "green";
      break;
    case "gemC":
      document.getElementById("score").style.backgroundColor = "blue";
      break;
    case "gemD":
      document.getElementById("score").style.backgroundColor = "orange";
      break;
    case "gemE":
      document.getElementById("score").style.backgroundColor = "purple";
      break;
    case "gemF":
      document.getElementById("score").style.backgroundColor = "yellow";
      break;
  }
}
