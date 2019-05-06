var gameState;
var gameId;
var playerId;

function send(move) {
    var socket = io();
    socket.emit('move', gameId, playerId, move);
};
    
$(function () {
    var socket = io();
    socket.on('gameState', function(msg){
        gameState = msg;
        updateGameState(msg);
    });

    socket.on('init', function(a, b){
        gameId = a;
        playerId = b;
    })
});