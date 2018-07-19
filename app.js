var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var usernames = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){

    socket.on('newuser',function(data,callback){
        if (usernames.indexOf(data) != -1) {
            callback(false);
        } else {
            callback(true);
            socket.username = data;
            console.log(data);
            
            usernames.push(socket.username);
            updateUsernames();
        }
    });

    // Upadate Usernames
    function updateUsernames(){
        io.sockets.emit('usernames',usernames);
    }


    //send message
    socket.on('chat message', function(data){
        io.sockets.emit('chat message', {msg : data, user: socket.username});
    });

    // disconnect
    socket.on('disconnect', function(data){
        if(!socket.username) return;
        usernames.splice(usernames.indexOf(socket.usernames),1);
        updateUsernames();
    });


  });

http.listen(port, function(){
  console.log('listening on *:' + port);
});