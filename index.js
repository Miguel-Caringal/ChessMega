var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var games = [];

io.on('connection', function(socket){
  games.push(socket.id);
  console.log(games);
  socket.on('chat message', function(msg){
    console.log(games.indexOf(socket.id));
    var gamenum = "(Game: " + (Math.floor(games.indexOf(socket.id) / 2) + 1) + ") ";
    var mssg = gamenum + "Player " + (games.indexOf(socket.id) + 1) + ": " + msg;
    io.emit('chat message', mssg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});