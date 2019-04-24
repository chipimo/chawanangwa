const io = require("./index").io;
const {
  USER_IS_REGSTARTED,
  DEVICE_DISCONNECTED,
  USER_CONNECTED,
  USER_REGSTRATION,
  VERIFY_USER,
  USER_IS_VERIFYED,
  USER_NOT_VERIFYED,
  USER_NOT_EXIST,
  PRODUCT_ENTRY,
  PRODUCT_ENTRY_DONE,
  PRODUCTS_RESULTS,
  PRODUCTS,
  NEW_PROUDCT,
  DELETE_ITEM,
  PRODUCT_REMOVED,
  PRODUCT_REMOVE_ERR,
  PRODUCTS_RESULTS_ERR,
  PRODUCT_UPDATE,
  PRODUCT_UPDATE_DONE,NEW_BUNDLE
} = require("./events");
const {
  _putNewUser,
  _getUser_ByUserName,
  _putNewProudct,
  _getProudct,
  _removeItem,
  _update
} = require("./db/queries");

module.exports = function(socket) {
  socket.on("connected", () => {
    console.log(socket.id);
  });

  socket.on("disconnect", () => {
    io.emit(DEVICE_DISCONNECTED, socket.id);
    console.log("Device disconneced");
  });

  socket.on(NEW_BUNDLE, resData => {
    console.log(resData);
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
        if (
          callback.userData.credentials[0].password === userData.user.password
        ) {
          io.to(callback.socketId).emit(USER_IS_VERIFYED, callback.userData);
        } else {
          io.to(callback.socketId).emit(USER_NOT_VERIFYED, callback.userData);
        }
      } else {
        io.to(callback.socketId).emit(USER_NOT_EXIST, callback.userData);
      }
    });
  });

  socket.on(PRODUCT_ENTRY, data => {
    let productData = {
      data: data,
      socketId: socket.id
    };
    _putNewProudct(productData, callback => {
      io.to(callback.socketId).emit(PRODUCT_ENTRY_DONE, callback.productData);
      io.emit(NEW_PROUDCT, {
        id: {
          name: callback.productData.name,
          id: callback.productData.product_id
        }
      });
    });
  });

  socket.on(PRODUCT_UPDATE, data => {
    let productData = {
      data: data,
      socketId: socket.id
    };
    _update(productData, callback => {
      io.to(callback.socketId).emit(
        PRODUCT_UPDATE_DONE,
        callback.productData.products
      );
    });
  });

  socket.on(PRODUCTS, data => {
    let productData = {
      data: "all",
      socketId: socket.id
    };

    _getProudct(productData, callback => {
      if (callback.Error) {
        io.to(callback.socketId).emit(PRODUCTS_RESULTS_ERR);
      } else {
        io.to(callback.socketId).emit(PRODUCTS_RESULTS, callback.productData);
      }
    });
  });

  socket.on(DELETE_ITEM, data => {
    let productData = {
      data: "all",
      socketId: socket.id
    };
    _removeItem(data, callback => {
      if (callback.Error) {
        return io.emit(PRODUCT_REMOVE_ERR);
      } else {
        io.emit(PRODUCT_REMOVED, callback.Data);
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
    });
  });
};
