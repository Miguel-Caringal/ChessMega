
//TODO : IMPLEMENT AUTH TOKENS AND DON'T ALLOW A SINGLE USER TO CONNECT MORE THAN ONCE.

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
    constructor(gamestate, gameid, white, black,turn){
        this.gamestate = gamestate;
        this.gameid = gameid;
        this.white = white;
        this.black = black;
        this.turn = turn;
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

    var io = res.app.io;    
    io.on('connection', function (socket) {
        console.log(socket.id+"has made a connection")

        var check = false

        //Adds player to list of players
        // This is a bandaid for right now. Reason is that while testing, having multiple socket connections from the same client confuses socket io (I think.) Will be fixed once multiple socket connections from the same client are not allowed. 
        if (players.includes(socket.id) == false ){
            players.push(socket.id);
            check = true
        }

        //console.log(players)

        // This is a bandaid for right now. Reason is that while testing, having multiple socket connections from the same client confuses socket io (I think.) Will be fixed once multiple socket connections from the same client are not allowed. 
        if (socket.id in socketidtogameid == false && check == true){
            console.log ("why?")
            waiting_room.push(socket.id)
        }

        console.log(waiting_room)
        // If Game will be created -> Room is full
        if (waiting_room.length == 2) {
            var gameID = 0

            // If there are no games currently
            if (games.length == 0){
                games.push(new Game (startBoard, 0, waiting_room[0],waiting_room[1], white))
            }
            else{
                var newSlot = true;
                for (i = 0; i<= games.length;i++){
                    if (games[i] == ''){
                        games[i] = new Game (startBoard,i, waiting_room[0],waiting_room[1], white);
                        newSlot = False;
                        gameID = i
                    }
                }
                // If there are no open game slots, make a new game
                if (newSlot == true){
                    games.push(new Game(startBoard,games.length, waiting_room[0],waiting_room[1], white))
                    gameID = games.length-1
                }
            }

            // Populating dictionary with socketids:gameids
            for (i = 0; i<= waiting_room.length;i++){
                socketidtogameid[waiting_room[i]] = gameID;
            }

            io.to(waiting_room[0]).emit('gameState', games[gameID]);
            io.to(waiting_room[1]).emit('gameState', games[gameID]);
            console.log(socketidtogameid)
            waiting_room = []
        }
        
        socket.on('move', (updatedGame, move) => {

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
