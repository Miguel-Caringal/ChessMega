const express = require('express');
var router = express.Router();
var moves = require('./moves');


// Globals
var games = [];
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

function flipboard (board){
    var newboard = [] ,temp = [];
    for (var i = 7; i>=0; i--){
        for (var j = 7; j>= 0; j--){
            temp.push(board[i][j])
        }
        newboard.push(temp)
        temp = []
    }  
    return newboard;
};

function flipmove (move){
    for (var i =0; i <=3; i++){
        move[i] = 7-move[i];
    }
    return move;
};

// Add timer

/*
function timer() {
    for (var i = 0; i < moves.length; i++) {
        if (moves[i] == 1) {
            times[i] += 1;
        }
    }
}
*/

router.get('/', function (req, res) {

    // Initial Board State
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

    // serve page
    res.render('index', { title: 'Chess Mega' });

    var io = res.app.io;    
    io.once('connection', function (socket) {
        //console.log(socket.id+"has made a connection")

        var check = false

        // This is probably not needed now due to bugfixing multiple connections from one client
        //Adds player to list of players
        if (players.includes(socket.id) == false ){
            players.push(socket.id);
            check = true
        }

        if (socket.id in socketidtogameid == false && check == true){
            waiting_room.push(socket.id);
        }

        // If Game will be created -> Room is full
        if (waiting_room.length == 2) {
            var gameID = 0;

            // If there are no games currently
            if (games.length == 0){
                games.push(new Game (startBoard, 0, waiting_room[0],waiting_room[1], "white"));
            }
            else{
                var newSlot = true;
                for (i = 0; i<= games.length;i++){
                    if (games[i] == ''){
                        //console.log(games[i].gamestate)
                        console.log(startBoard)
                        games[i] = new Game (startBoard,i, waiting_room[0],waiting_room[1], "white");
                        console.log(startBoard)
                        newSlot = false;
                        //console.log(games[i].gamestate)
                        gameID = i
                    }
                }
                // If there are no open game slots, make a new game
                if (newSlot == true){
                    games.push(new Game(startBoard,games.length, waiting_room[0],waiting_room[1], "white"));
                    gameID = games.length-1;
                }
            }
            // Populating dictionary with socketids:gameids
            for (i = 0; i<= waiting_room.length;i++){
                socketidtogameid[waiting_room[i]] = gameID;
            }

            // Push to White
            io.to(waiting_room[0]).emit('gameState', games[gameID]);
            io.to(waiting_room[0]).emit('init', "white");
            // Push to Black
            games[gameID].gamestate = flipboard(games[gameID].gamestate);
            io.to(waiting_room[1]).emit('gameState', games[gameID]);
            io.to(waiting_room[1]).emit('init', "black");
            games[gameID].gamestate = flipboard(games[gameID].gamestate);
            waiting_room = []
        }
        
        // Processing Player Moves
        socket.on('move', (updatedGame, move) => {
            var returnvalues = []

            // If a player tries to make two moves in a row
            if (updatedGame.turn == "white" && socket.id == updatedGame.black) {
                return;
            }
            else if (updatedGame.turn == "black" && socket.id == updatedGame.white){
                return;
            }

            // Flipping board and move
            if (socket.id == updatedGame.black){
                updatedGame.gamestate = flipboard(updatedGame.gamestate); 
                move = flipmove(move);
            }

            returnvalues = moves.checkmove(updatedGame,move)

            islegal = returnvalues[0];
            promote = returnvalues[1];

            if (islegal == true){
                // Updating the board with the new move
                games[updatedGame.gameid].gamestate[move[3]][move[2]] = games[updatedGame.gameid].gamestate[move[1]][move[0]];
                games[updatedGame.gameid].gamestate[move[1]][move[0]] = '';
                
                if (promote!= ""){
                    if (promote[2] == "w"){
                        games[updatedGame.gameid].gamestate[promote[0]][promote[1]] = "wq";
                    }
                    else if (promote[2] == "b"){
                        games[updatedGame.gameid].gamestate[promote[0]][promote[1]] = "bq";
                    }
                }

                // Switching Who's turn it is
                if (updatedGame.turn == "white"){
                    games[updatedGame.gameid].turn = "black";
                }
                else if (updatedGame.turn == "black"){
                    games[updatedGame.gameid].turn = "white";
                }
                // Sending new gamestate
                io.to(games[updatedGame.gameid].white).emit('gameState', games[updatedGame.gameid]);

                // Flipping for black
                games[updatedGame.gameid].gamestate= flipboard(games[updatedGame.gameid].gamestate); 
                io.to(games[updatedGame.gameid].black).emit('gameState', games[updatedGame.gameid]);
                games[updatedGame.gameid].gamestate= flipboard(games[updatedGame.gameid].gamestate); 
            }

        })

        // If someone RQs/DCs
        // TODO: ADD RECONNECT/TIMEOUT FEATURES
        socket.on('disconnect', function(){

            // If the user was in the game and DCs, then the other user should win
            if (socket.id in socketidtogameid) {
                console.log(socketidtogameid)
                var winner;
                var loser;

                if (socket.id == games[socketidtogameid[socket.id]].black){
                    winner = games[socketidtogameid[socket.id]].white;
                    loser = games[socketidtogameid[socket.id]].black;
                }
                else{
                    winner = games[socketidtogameid[socket.id]].black;
                    loser = games[socketidtogameid[socket.id]].white;
                }

                io.to(winner).emit('gameOver',"win");
                // Not needed for now.
                //io.to(loser).emit('gameOver',"lose");
                games[socketidtogameid[socket.id]] = '';
                delete socketidtogameid[winner];
                delete socketidtogameid[loser];
            }
        });
    });
});

module.exports = router;
