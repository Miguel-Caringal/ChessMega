var gameState;
var gameId;
var socket = io();

function send(move) {
    socket.emit('move', gameId, playerId, move);
};
    

socket.on('gameState', function(Game){
	gameState = Game.gamestate
	gameId = Game.gameid
    updateGameState(gameState);
});
