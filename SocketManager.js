const io = require("./index").io;
const {
  USER_IS_REGSTARTED,
  DEVICE_DISCONNECTED,
  USER_CONNECTED,
  USER_REGSTRATION,
  VERIFY_USER,
  USER_IS_VERIFYED,
  USER_NOT_VERIFYED,
  USER_NOT_EXIST
} = require("./events");
const { _putNewUser, _getUser_ByUserName } = require("./db/queries");

module.exports = function(socket) {
  socket.on("connected", () => {
    console.log(socket.id);
  });

  socket.on("disconnect", () => {
    io.emit(DEVICE_DISCONNECTED, socket.id);
    console.log("Device disconneced");
  });

  socket.on(USER_CONNECTED, user => {
    user.socketId = socket.id;
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    io.emit(USER_CONNECTED, connectedUsers);
  });

  socket.on(VERIFY_USER, user => {
    let userData = {
      user: user,
      socketId: socket.id 
    };
    _getUser_ByUserName(userData, callback => {
      if (callback.isSet) {
        if (callback.userData.credentials[0].password === userData.user.password) {
          io.to(callback.socketId).emit(USER_IS_VERIFYED, callback.userData);
        } else {
          io.to(callback.socketId).emit(USER_NOT_VERIFYED, callback.userData);
        }
      } else {
        io.to(callback.socketId).emit(USER_NOT_EXIST, callback.userData);
      }
    });
  });

  socket.on(USER_REGSTRATION, user => {
    let userData = {
      user: user,
      socketId: socket.id
    };
    _putNewUser(userData, callback => {
      io.to(callback.socketId).emit(USER_IS_REGSTARTED, callback.userData);
      console.log(callback.userData);
      
    });
  });
};
