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
  if (game[move[0]][move[1]].indexOf("n")>-1){
      islegal = isKnight(game,move);
  }
  if (game[move[0]][move[1]][1] == "b"){      
      islegal = isBishop(game,move);
  }
  if (game[move[0]][move[1]].indexOf("q")>-1){
    islegal = isQueen(game,move);
  }
  if (game[move[0]][move[1]].indexOf("p")>-1){
    islegal = isPawn(game,move);
  }
  /*
  if (game[move[0]][move[1]].indexOf("k")>-1){
      islegal = isKing(game,move);
  }
  */
 if (game[move[0]][move[1]]==''){
    return false;
 }

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

function isKnight (game,move){
    if (Math.abs(move[0]-move[2]) == 2 && Math.abs(move[1]-move[3]) == 1) {
        if (sameColor(game,move)){
            return false;
        }
        return true;
    }
    if (Math.abs(move[1]-move[3]) == 2 && Math.abs(move[0]-move[2]) == 1) {
        if (sameColor(game,move)){
            return false;
        }
        return true;
    }
    return false;
}

function isBishop (game,move){
    
    if (Math.abs(move[0]-move[2]) != Math.abs(move[1]-move[3])){
        return false;
    }
    if (move[0] < move [2] && move[1] < move[3]){
        for (var i = 1;i<move[2]-move[0];i++){
            if (game[i+move[0]][i+move[1]] != ''){
                return false;
            }
        }
        if (sameColor(game,move)){
            return false
        }
    }
    else if (move[0] > move [2] && move[1] > move[3]){
        for (var i = 1;i<move[2]-move[0];i++){
            if (game[move[0]-1][move[1]-1] != ''){
                return false;
            }
        }
        if (sameColor(game,move)){
            return false
        }
    }
    else if (move[0] > move [2] && move[1] < move[3]){
        for (var i = 1; i<move[0]-move[2];i++){
            if (game[move[0]-1][move[1]+1] != ''){
                return false;
            }
        }
        if (sameColor(game,move)){
            return false
        }
    }
    else if (move[0] < move [2] && move[1] > move[3]){
        for (var i = 1; i<move[2]-move[0];i++){
            if (game[move[0]+1][move[1]-1] != ''){
                return false;
            }
        }
        if (sameColor(game,move)){
            return false
        }
    }
    return true;
}

function isQueen(game,move){
    // if bishop like move
    if (Math.abs(move[0]-move[2]) == Math.abs(move[1]-move[3])){
        return isBishop(game,move);
    }
    // if rook like move
    else if (move[0] == move [2] || move[1] == move[3]){
        return isRook(game,move);
    }
}

function isPawn(game,move){
    if (Math.abs(move[0]-move[2])>2){
        return false;
    }

    var color;
    if (game[move[0]][move[1]][0] == "w"){
        color = "w";
    }
    else{
        color = "b";
    }
    // White Pawn Moving Forward by One Square
    if ((move[0]-move[2] == 1) && move[1] == move[3]){
        if (game[move[2]][move[3]] == '' && color == "w"){
            return true;
        }
    }
    // Black Pawn Moving Forward by One Square
    if ((move[0]-move[2] == -1) && move[1] == move[3]){
        if (game[move[2]][move[3]] == '' && color == "b"){
            return true;
        }
    }
    // White Pawn Moving Forward by Two Squares
    if ((move[0]-move[2] == 2) && move[1] == move[3]){
        if (move[0] != 6){
            return false;
        }
        for (var i = 5; i >= 4 ; i--){
            if (game[i][move[1]] != ''){
                return false;
            }
        }
        return true;
    }
    // Black Pawn Moving Forward by Two Squares
    if ((move[0]-move[2] == -2) && move[1] == move[3]){
        if (move[0] != 1){
            return false;
        }
        for (var i = 2; i >= 3 ; i++){
            if (game[i][move[1]] != ''){
                return false;
            }
        }
        return true;
    }
    // white pawn capturing
    if (move[0]-move[2] == 1 && move[1]-move[3] == 1 && color == "w"){
        if (game[move[2]][move[3]] != '' && game[move[2]][move[3]][0] != "w"){
            return true;
        }
    }
    if (move[0]-move[2] == 1 && move[1]-move[3] == -1 && color == "w"){
        if (game[move[2]][move[3]] != '' && game[move[2]][move[3]][0] != "w"){
            return true;
        }
    }
    //black pawn capturing
    if (move[0]-move[2] == -1 && move[1]-move[3] == 1 && color == "b"){
        if (game[move[2]][move[3]] != '' && game[move[2]][move[3]][0] != "b"){
            return true;
        }
    }
    if (move[0]-move[2] == -1 && move[1]-move[3] == -1 && color == "b"){
        if (game[move[2]][move[3]] != '' && game[move[2]][move[3]][0] != "b"){
            return true;
        }
    }
    return false;
}


module.exports = {
   checkmove,
   sameColor,
   isRook,
};