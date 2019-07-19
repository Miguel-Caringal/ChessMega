function checkmove (gameobj, oldmove) {

  move = [Number(oldmove[1]),Number(oldmove[0]),Number(oldmove[3]),Number(oldmove[2])]

  game = gameobj.gamestate

  if (move[0] == move [2] && move [1] == move [3]){
      return [false,false];
  }

  if (sameColor(game,move)){
      return [false,false];
  }

  var islegal = true, promote = "", returnvalues = [];

  // ischeck();

  if (game[move[0]][move[1]].indexOf("r")>-1){
      islegal = isRook(game,move);
  }
  else if (game[move[0]][move[1]].indexOf("n")>-1){
      islegal = isKnight(game,move);
  }
  else if (game[move[0]][move[1]][1] == "b"){      
      islegal = isBishop(game,move);
  }
  else if (game[move[0]][move[1]].indexOf("q")>-1){
    islegal = isQueen(game,move);
  }
  else if (game[move[0]][move[1]].indexOf("p")>-1){
    islegal = isPawn(game,move, false);
    if (islegal){
        promote = isPromote(game,move)
    }
  }
  else if (game[move[0]][move[1]].indexOf("k")>-1){
      islegal = isKing(game,move);
  }
  else if (game[move[0]][move[1]]==''){
    return [false,false];
  }

  // check the if the player making the moves' king is in check, making the move illegal
  kinglocation = findKing(game, move)

  // add function to check if other king is in check after move is made, so that we know when to check for checkmate



  // isstale();

  console.log(islegal);
  returnvalues.push(islegal)
  returnvalues.push(promote)
  return returnvalues;
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

function findKing (game,move){

}

// Function to check if piece is under attack on a certain square 
function ischeck (game, square){
    var attackcolor, check = false;
    if (game[square[0]][square[1]][0] == "w"){
        attackcolor = "b";
    }
    else {
        attackcolor = "w";
    }

    for (var i = 7; i>=0; i--){
        for (var j = 7; j>= 0; j--){
            if (game[i][j][0] == attackcolor){
                if (game[i][j][1] == "r"){
                    check = isRook(game,[i,j,square[0],square[1]])
                }
                else if (game[i][j][1] == "n"){
                    check = isKnight(game,[i,j,square[0],square[1]])
                }
                else if (game[i][j][1] == "b"){
                    check = isBishop(game,[i,j,square[0],square[1]])
                }
                else if (game[i][j][1] == "q"){
                    check = isQueen(game,[i,j,square[0],square[1]])
                }
                // Possible recursion problem
                else if (game[i][j][1] == "k"){
                    check = checkKing(game,[i,j,square[0],square[1]])
                }
                // potential bugs here 
                else if (game[i][j][1] == "p"){
                    check = isPawn(game,[i,j,square[0],square[1]], true)
                }
                if (check == true) {
                    return true;
                }
            }
        }
    }  
}   

function isPromote(game,move){
    var color, promote;
    if (game[move[0]][move[1]][0] == "w"){
        color = "w";
    }
    else{
        color = "b";
    }
    if (move[2] == 0 && color == "w"){
        promote = []
        promote.push (move[2])
        promote.push (move[3])
        promote.push (color)
        return promote;
    }
    if (move[2] == 7 && color == "b"){
        promote = []
        promote.push (move[2])
        promote.push (move[3])
        promote.push (color)
        return promote;
    }
    return "";
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
                  return false;
              }
          }
          // if own colored piece
          if (sameColor(game,move)){
              return false;
          }
      }
      else {
          for (var i = move[1]+1;i < move[3]; i++){
              if (game[move[0]][i] != '' ){
                  return false;
              }
          }
          if (sameColor(game,move)){
              return false;
          }
      }
  }
  // vert
  else if (move[1]==move[3]) {
      if(move[0] > move[2]){
          // here, return piece that was blocking for ischeck function
          for (var i = move[0]-1;i>move[2];i--){
              if (game[i][move[1]] != '' ){
                  return false;
              }
          }
          // if own colored piece
          if (sameColor(game,move)){
              return false;
          }
      }
      else {
          for (var i = move[0]+1;i < move[2]; i++){
              if (game[i][move[1]] != '' ){
                  return false;
              }
          }
          if (sameColor(game,move)){
              return false;
          }
      }
  }
  return true;
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

function isPawn(game,move, onlycheck){
    // if the move is more than 2 squares
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

    if (onlycheck == false){
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
    // TODO : EN PASSANT
    return false;
}

function isKing (game,move){
    var ifcheck;
    if (Math.abs(move[0]-move[2]) > 1 || Math.abs(move[1]-move[3]) > 1 ){
        return false;
    }
    if (sameColor(game,move)){
        return false;
    }
    game[move[2]][move[3]] = game[move[0]][move[1]];
    game[move[0]][move[1]] = '';
    ifcheck = ischeck (game,[move[2],move[3]]);
    if (ifcheck){
        return false;
    }
    else {
        return true;
    }

}

function checkKing (game,move){
    if (Math.abs(move[0]-move[2]) + Math.abs(move[1]-move[3]) <= 2  && Math.abs(move[1]-move[3]) < 2 && Math.abs(move[0]-move[1]) < 2){
        return true;
    }
    return false;
}

module.exports = {
   checkmove
};