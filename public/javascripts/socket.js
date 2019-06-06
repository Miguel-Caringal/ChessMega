var gameState;
var socket = io();
var updatedGame;

socket.on('gameState', function(Game){
	updatedGame = Game
	gameState = Game.gamestate
	document.getElementById("turn").innerHTML = "It is now " + Game.turn + "'s turn";
    updateGameState(gameState);
});

socket.on('gameOver', function(result){
	if (result == "win"){
		document.getElementById("gameResult").innerHTML = "You Win!";
	}
});

socket.on('init', function(color){
	document.getElementById("color").innerHTML = "You are: " + color;
});

function send(move) {
    socket.emit('move', updatedGame , move);
}; 
