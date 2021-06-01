module.exports = function(io) {
    // arr -> nhung nguoi trong chat
    var usernames = [];

    // lang nghe tat ca socket tren server -> de bat su kien
    io.sockets.on("connection", function(socket) {
        // function mo socket
        console.log("Have a new user connected!");
        // listen adduser event
        // socket.on() -> lang nghe su kien -> ten su kien === ben client
        socket.on("addUser", function(username) {
            // save
            socket.username = username;
            // console.log(socket.username);
            usernames.push(username);
            
            // inform client
            var data = {
                sender: "SERVER",
                message: "You have join chat room"
            };
            socket.emit("update_message", data);

            // notify to other users -> broadcast
            var data = {
                sender: "SERVER",
                message: username + " have join chat room"
            };
            socket.broadcast.emit("update_message", data) // gui den user khac tru ban than no -> broadcast
        })

        // listen send_message event 
        socket.on("send_message", function(message) {
            // notify to my self
            let data = {
                sender: "You",
                message: message
            };
            socket.emit("update_message", data);

            // notify to other users
            data = {
                sender: socket.username,    // nguoi gui tin nhan: socket
                message: message
            }
            socket.broadcast.emit("update_message", data);
        })

        // disconect event
        socket.on("disconnect", function() {
            // Delete username
            for (let i = 0; i < usernames.length; i++) {
                if (usernames[i] == socket.username) {
                    usernames.splice(i, 1);
                }
            }

            // notify to other users 
            var data = {
                sender: "SERVER",
                message: socket.username + " left chat room"
            };
            socket.broadcast.emit("update_message", data);
        })
    })
}