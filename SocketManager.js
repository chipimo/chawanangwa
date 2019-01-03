const io = require("./index").io;

module.exports = function(socket) {
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("connect", user => {
    user.socketId = socket.id;
    
    console.log("user connc");
    
  });

};


