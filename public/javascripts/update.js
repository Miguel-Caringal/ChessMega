function updateGameState(gamestate) {
    for(var i = 0; i < gamestate.length; i++) {
        for(var j = 0; j < gamestate[i].length; j++) {
            name = gamestate[i][j];

            if(name){
                document.getElementById(j + "x" + i).src = "/images/pieces/" + name + ".png";
            } else {
                document.getElementById(j + "x" + i).src = "/images/pieces/blank.png";
            }
        }
    }
}