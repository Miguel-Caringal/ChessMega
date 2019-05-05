var testinput = [
    ['br','bn','bb','bq','bk','bb','bn','br'],
    ['bp','bp','bp','bp','bp','bp','bp','bp'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['wp','wp','wp','wp','wp','wp','wp','wp'],
    ['wr','wn','wb','wq','wk','wb','wn','wr']
  ]


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

document.addEventListener('DOMContentLoaded', (event) => {
    updateGameState(testinput);
})