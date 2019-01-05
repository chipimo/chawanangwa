const io = require("./index").io;

module.exports = function(socket) {
  
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  
  socket.on("connect", user => {
    user.socketId = socket.id;
    // io.emit(DEVICE_ID, socket.id)
  });

};


