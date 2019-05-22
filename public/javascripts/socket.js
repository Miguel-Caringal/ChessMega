var gameState;
var socket = io();
var updatedGame;

socket.on('gameState', function(Game){
	updatedGame = Game
	gameState = Game.gamestate
    updateGameState(gameState);
});

socket.on('gameOver', function(result){
	if (result == "win"){
		document.getElementById("gameResult").innerHTML = "You Win!";
	}

})

function send(move) {
    socket.emit('move', updatedGame , move);
}; 
