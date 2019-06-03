function checkmove (gameobj, oldmove) {

  move = [Number(oldmove[1]),Number(oldmove[0]),Number(oldmove[3]),Number(oldmove[2])]

  game = gameobj.gamestate

  if (move[0] == move [2] && move [1] == move [3]){
      return false;
  }

  var islegal = true;

  // ischeck();



  if (game[move[0]][move[1]].indexOf("r")>-1){
      islegal = isRook(game,move);
  }
  /*
  if (game[move[0]][move[1]].indexOf("k")>-1){
      islegal = isKnight();
  }
  if (game[move[0]][move[1]].indexOf("b")>-1){
      islegal = isBishop();
  }
  if (game[move[0]][move[1]].indexOf("p")>-1){
      islegal = isPawn();
  }
  if (game[move[0]][move[1]].indexOf("k")>-1){
      islegal = isKing();
  }
  if (game[move[0]][move[1]].indexOf("q")>-1){
      islegal = isQueen();
  }
  */

  // isstale();

  console.log(islegal);
  return islegal;
};

// Function which tells if two pieces are the same color
function sameColor (game,move) {
  if (game[move[0]][move[1]].indexOf("w")>-1 && game[move[2]][move[3]].indexOf("w")>-1) {
      return true;
  }
  else if (game[move[0]][move[1]].indexOf("b")>-1 && game[move[2]][move[3]].indexOf("b")>-1) {
      return true;
  };
  return false
}

function isRook(game,move) {
  if (move[0] != move [2] && move [1] != move [3]){
      return false;
  };

  // horz
  if (move[0] == move [2]){

      if(move[1] > move[3]){
          // here, return piece that was blocking for ischeck function
          for (var i = move[1]-1;i>move[3];i--){
              if (game[move[0]][i] != '' ){
                  return false
              }
          }
          // if own colored piece
          if (sameColor(game,move)){
              return false
          }
      }
      else {
          for (var i = move[1]+1;i < move[3]; i++){
              if (game[move[0]][i] != '' ){
                  return false
              }
          }
          if (sameColor(game,move)){
              return false
          }
      }
  }
  // vert
  else if (move[1]==move[3]) {
      if(move[0] > move[2]){
          // here, return piece that was blocking for ischeck function
          for (var i = move[0]-1;i>move[2];i--){
              if (game[i][move[1]] != '' ){
                console.log(game[i][move[1]])
                  return false
              }
          }
          // if own colored piece
          if (sameColor(game,move)){
              return false
          }
      }
      else {
          for (var i = move[0]+1;i < move[2]; i++){
              if (game[i][move[1]] != '' ){
                  return false
              }
          }
          if (sameColor(game,move)){
              return false
          }
      }
  }
  return true
};

module.exports = {
   checkmove,
   sameColor,
   isRook,
};