var gameState;
var socket = io();
var updatedGame;

socket.on('gameState', function(Game){
	updatedGame = Game
	gameState = Game.gamestate
    updateGameState(gameState);
});

function send(move) {
    socket.emit('move', updatedGame , move);
}; 