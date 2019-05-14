var gameState;
var gameId;
var playerId;
var socket = io();

function send(move) {
    socket.emit('move', gameId, playerId, move);
};
    

socket.on('gameState', function(msg){
    gameState = msg;
    updateGameState(msg);
});

socket.on('init', function(a, b){
    gameId = a;
    playerId = b;
})