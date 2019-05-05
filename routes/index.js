var express = require('express');
var router = express.Router();

var games = [];
var times = [];
var moves = [];
var players = [];
var gameID = 0;

function timer() {
    for (var i = 0; i < moves.length; i++) {
        if (moves[i] == 1) {
            times[i] += 1;
        }
    }
}

startBoard = [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr']
]

router.get('/', function (req, res) {

    // serve page
    res.render('index', { title: 'Chess Mega' });

    // access io object stored in res
    var io = res.app.io;    
    io.on('connection', function (socket) {

        players.push(socket.id);
        var idnum = players.indexOf(socket.id);
        times.push(0);
        moves.push(0);

        if (moves.length == 2) {
            setInterval(timer, 1000);
        }
        
        if (idnum % 2 == 1) {
            // io.emit('chat message', "Game between Player " + idnum + " and Player " + (idnum + 1) + " has started.")
            moves[idnum - 1] = 1;
            games.push(startBoard);

            //tell player 1 game started
            var player1 = idnum;
            io.to(socket.id).emit('gameState', games[gameID]);
            io.to(socket.id).emit('init', games.length - 1, player1);

            //tell player 2 game started
            var player2 = idnum - 1;
            io.to(players[player2]).emit('gameState', games[gameID]);
            io.to(players[player2]).emit('init', games.length - 1, player2);

            gameID += 1;
        }
        
        socket.on('move', (gameId, num, move) => {

            console.log(gameId, num, moves)

            if (moves[num] != 0) {
                games[gameId][move[3]][move[2]] = games[gameId][move[1]][move[0]];
                games[gameId][move[1]][move[0]] = '';
                // console.log(games)
                moves[num] = 0;

                if (num % 2 == 0) {
                    moves[num + 1] = 1;
                    io.to(players[num]).emit('gameState', games[gameId]);
                    io.to(players[num + 1]).emit('gameState', games[gameId]);
                } else {
                    moves[num - 1] = 1;
                    io.to(players[num]).emit('gameState', games[gameId]);
                    io.to(players[num - 1]).emit('gameState', games[gameId]);
                }
            }

            
        })
        // console.log(players.indexOf(socket.id));
        // var gamenum = "(Game: " + (Math.floor(players.indexOf(socket.id) / 2) + 1) + ") ";
        // var time = "(Time Used: " + Math.floor(times[num]) + ") ";
        // var mssg = time + gamenum + "Player " + (players.indexOf(socket.id) + 1) + ": " + msg;
        // io.emit('chat message', mssg);
        //io.to(socket.id).emit('chat message', 'test');
    });
});

module.exports = router;
