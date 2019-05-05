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
            console.log(document.getElementById("0 0").innerHTML)
            document.getElementById(i + " " + j).src = "/images/pieces/" + gamestate[i][j] + ".png"
        }
    }
}

updateGameState(testinput);