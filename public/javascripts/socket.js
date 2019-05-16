var gameState;
var gameId;
var socket = io();
var updatedGame;

socket.on('gameState', function(Game){
	updatedGame = Game
	gameState = Game.gamestate
	gameId = Game.gameid
    updateGameState(gameState);
});

function send(move) {
    socket.emit('move', updatedGame , move);
}; 