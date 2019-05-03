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
  PRODUCT_UPDATE_DONE,
  NEW_BUNDLE,
  BUNDLE_CREATED
} = require("./events");
const {
  _putNewUser,
  _getUser_ByUserName,
  _putNewProudct,
  _getProudct,
  _removeItem,
  _update,
  _putNewNewBundle
} = require("./db/queries");
var cloudinary = require("cloudinary").v2;
var base64Img = require("base64-img");
require("custom-env").env();

var ProductList = {};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

module.exports = function(socket) {
  socket.on("connected", () => {
    console.log(socket.id);
  });

  socket.on("disconnect", () => {
    io.emit(DEVICE_DISCONNECTED, socket.id);
    console.log("Device disconneced");
  });

  socket.on(NEW_BUNDLE, resData => {
    _putNewNewBundle(resData, callback => {
      console.log(callback);
      io.emit(BUNDLE_CREATED, callback);
    });
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
    base64Img.img(
      "data:image/png;base64," + data.image + "",
      "./temFiles",
      "temp",
      function(err, filepath) {
        cloudinary.uploader.upload(filepath, function(error, result) {
          let productData = {
            data: data,
            socketId: socket.id,
            img: {
              url: result.url,
              secure_url: result.secure_url,
              format: result.format,
              public_id: result.public_id
            }
          };
          _putNewProudct(productData, callback => {
            ProductList = callback.productData;
            io.to(callback.socketId).emit(
              PRODUCT_ENTRY_DONE,
              callback.productData
            );
            io.emit(NEW_PROUDCT, {
              id: callback.productData
            });
          });
        });
      }
    );
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

    if (Object.keys(ProductList).length === 0) {
      _getProudct(productData, callback => {
        if (callback.Error) {
          io.to(callback.socketId).emit(PRODUCTS_RESULTS_ERR);
        } else {
          ProductList = callback.productData;
          io.to(callback.socketId).emit(PRODUCTS_RESULTS, callback.productData);
        }
      });
    } else {
      io.to(socket.id).emit(PRODUCTS_RESULTS, ProductList);
    }
  });

  socket.on(DELETE_ITEM, data => {
    cloudinary.uploader.destroy(data.public_id, function(error, result) {
      console.log(result, error);
      _removeItem(data.Productid, callback => {
        if (callback.Error) {
          return io.emit(PRODUCT_REMOVE_ERR);
        } else {
          io.emit(PRODUCT_REMOVED, callback.Data);
        }
      });
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
