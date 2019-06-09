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
  BUNDLE_CREATED,
  GET_ALL_USERS,
  ALL_USERS,
  LOGIN,
  ACTIVE_USERS,
  VERIFY_FB_USER
} = require("./events");
const {
  _putNewUser,
  _getUser_ByUserName,
  _putNewProudct,
  _getProudct,
  _removeItem,
  _update,
  _putNewNewBundle,
  _getAllUsers,
  _getUser_ById
} = require("./db/queries");
var cloudinary = require("cloudinary").v2;
var base64Img = require("base64-img");
const { Expo } = require("expo-server-sdk");
const { sendEmail } = require("./routes/SendMail");
const bcrypt = require("bcrypt");
const _ = require("lodash");

require("custom-env").env();

// Valuebles
let expo = new Expo();
let messages = [];
var idlist = [];
var ProductList = {};
var TempActiveUsers = [];
var activeUsers = [];
var Users = [];
require("custom-env").env();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

module.exports = function(socket) {
  socket.on("connected", () => {
    console.log(socket.id);
  });

  socket.on("UserConnected", userId => {
    console.log(userId);
  });

  // socket.on(LOGIN, id => {
  //   TempActiveUsers.push({
  //     id: id.userId,
  //     socketId: id.socketId,
  //     name: id.name,
  //     NotificationId: id.notiId
  //   });
  //   var result = _(TempActiveUsers)
  //     .differenceBy(
  //       [
  //         {
  //           id: id.userId,
  //           socketId: id.socketId,
  //           name: id.name,
  //           NotificationId: id.notiId
  //         }
  //       ],
  //       "id"
  //     )
  //     .concat([
  //       {
  //         id: id.userId,
  //         socketId: id.socketId,
  //         name: id.name,
  //         NotificationId: id.notiId
  //       }
  //     ])
  //     .value();
  //   activeUsers = result;
  //   console.log(activeUsers);

  //   io.emit(ACTIVE_USERS, result);
  // });

  socket.on("disconnect", () => {
    io.emit(DEVICE_DISCONNECTED, socket.id);
    console.log("Device disconneced");
  });

  socket.on(GET_ALL_USERS, () => {
    _getAllUsers(socket.id, callback => {
      // Users = callback.Users.users;
      // var NewArr = [];
      // var num = 0;

      // _.map(Users, item => {
      //   num++;
      //   _.map(activeUsers, item2 => {
      //     console.log(item2.id);

      //     if (item.user_id === item2.id) {
      //       newList = Object.assign(item, { online: true });
      //       NewArr.push(newList);
      //     } else {
      //       newList = Object.assign(item, { online: false });
      //       NewArr.push(newList);
      //     }
      //   });
      //   if (Users.length === num) {
      // console.log(NewArr); 

      io.to(callback.socketId).emit(ALL_USERS, callback);
      //   }
      // });
    });
  });

  socket.on(NEW_BUNDLE, resData => {
    _putNewNewBundle(resData, callback => {
      io.emit(BUNDLE_CREATED, callback);
    });
  });

  socket.on(USER_CONNECTED, user => {
    user.socketId = socket.id;
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;

    io.emit(USER_CONNECTED, connectedUsers);
  });

  socket.on(VERIFY_FB_USER, user => {
    let userData = {
      user: user,
      socketId: socket.id
    };

    if (user.check) {
      _getUser_ById(userData, callback => {
        
        if (callback.isSet) {
          bcrypt.compare(
            user.id,
            callback.userData.credentials[0].Password,
            function(err, res) {
              if (res) {
                io.to(callback.socketId).emit(USER_IS_REGSTARTED, callback);
              } else {
                io.to(callback.socketId).emit(USER_NOT_VERIFYED);
              }
            }
          );
        } else {
          io.to(callback.socketId).emit(USER_NOT_EXIST, callback);
        }
      });
    } else {
      cloudinary.uploader.upload(
        user.image,
        { public_id: `profile/${user.id}`, tags: "profile" },
        function(error, result) {
          let data = {
            socketId: socket.id,
            name: user.name,
            email: user.email,
            password: user.id,
            img: result,
            id: user.id,
            isSingedin: true,
            withImg: true
          };
          if (result) {
            _putNewUser(data, callback => {
              if (!callback.exists) {
                io.to(callback.socketId).emit(USER_IS_REGSTARTED, callback);
              } else {
                io.to(callback.socketId).emit(USER_IS_REGSTARTED, callback);
              }
            });
          }
        }
      );
    }
  });

  socket.on(VERIFY_USER, user => {
    let userData = {
      user: user,
      socketId: socket.id
    };

    _getUser_ByUserName(userData, callback => {
      if (callback.isSet) {
        bcrypt.compare(
          userData.user.password,
          callback.userData.credentials[0].Password,
          function(err, res) {
            if (res)
              io.to(callback.socketId).emit(
                USER_IS_VERIFYED,
                callback.userData
              );
            else io.to(callback.socketId).emit(USER_NOT_VERIFYED);
          }
        );
      } else {
        io.to(callback.socketId).emit(USER_NOT_EXIST);
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
              all: callback.productData,
              item: {
                name: productData.data.name,
                icon: productData.img.url
              }
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
      _removeItem(data.Productid, callback => {
        if (callback.Error) {
          return io.emit(PRODUCT_REMOVE_ERR);
        } else {
          ProductList = callback.Data;

          io.emit(PRODUCT_REMOVED, { all: callback.Data, item: data });
        }
      });
    });
  });

  socket.on(USER_REGSTRATION, user => {
    let data = {
      socketId: socket.id,
      name: user.name,
      email: user.email,
      password: user.password,
      isSingedin: true,
      withImg: false
    };

    _putNewUser(data, callback => {
      if (!callback.exists) {
        // sendEmail([
        //   {
        //     name: callback.userData.credentials[0].user_name,
        //     email: callback.userData.credentials[0].email
        //   }
        // ]);

        io.to(callback.socketId).emit(USER_IS_REGSTARTED, callback);
      } else {
        io.to(callback.socketId).emit(USER_IS_REGSTARTED, callback);
      }
    });
  });
};

const addToUser = function(id, callback) {};
