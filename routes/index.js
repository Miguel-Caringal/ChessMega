var express = require('express');
var router = express.Router();

// Globals
var games = [];
var moves = [];
var players = [];
var waiting_room = [];
var socketidtogameid = {};

// Object to be passed between client and server
class Game {
    constructor(gamestate, gameid, white, black){
        this.gamestate = gamestate;
        this.gameid = gameid;
        this.white = white;
        this.black = black;
    }
}

/*
function timer() {
    for (var i = 0; i < moves.length; i++) {
        if (moves[i] == 1) {
            times[i] += 1;
        }
    }
}
*/

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

        //Adds player to list of players
        players.push(socket.id);
        var idnum = players.indexOf(socket.id);
        moves.push(0);

        // If Game will be created
        if (waiting_room.length == 2) {


            var gameID = 0

            // If there are no games currently
            if (games.length == 0){
                games.push(new Game (startBoard, 0, waiting_room[0],waiting_room[1]))
            }
            else{
                var newSlot = True;
                for (i = 0; i<= games.length;i++){
                    if (games[i] == ''){
                        games[i] = new Game (startBoard,i, waiting_room[0],waiting_room[1]);
                        newSlot = False;
                        gameID = i
                    }
                }
                // If there are no open game slots, make a new game
                if (newSlot == True){
                    games.push(new Game(startBoard,games.length, waiting_room[0],waiting_room[1]))
                    gameID = games.length-1
                }
            }

            //moves[idnum - 1] = 1;
            //games.push(startBoard);

            console.log("hi")

            // Populating dictionary with socketids:gameids
            for (i = 0; i<= waiting_room.length;i++){
                socketidtogameid[waiting_room[i]] = gameID;
            }

            io.to(waiting_room[0]).emit('gameState', games[gameID]);
            io.to(waiting_room[1]).emit('gameState', games[gameID]);

            waiting_room = []
        }
        else {
            waiting_room.push(socket.id)
        }
        
        socket.on('move', (gameId, num, move) => {

            //console.log("hi")

            //console.log(gameId, num, moves)

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
