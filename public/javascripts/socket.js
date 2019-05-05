function send(msg) {
    var socket = io();
    console.log(msg);
    socket.emit('move', msg);
    return false;
};

var gameState;
    
$(function () {
    var socket = io();
    socket.on('gameState', function(msg){
        gameState = msg;
        updateGameState(msg);
    });

    socket.on('init', function(msg){
        updateGameState(gameState);
    })
});