const knex = require("../knex"); // the connection!
const uuidv4 = require("uuid/v4");

function CreateId() {
  return uuidv4();
}

module.exports = {
  _getAllUsers() {},
  _getUser_ById(user_id, callback) {},
  
  _getUser_ByUserName(user_credentials, callback) {
    knex 
      .select()
      .from("nonsubscribers")
      .where("user_name", user_credentials.user.username)
      .then(function(user) {
        if (user.length === 0) {
          callback({
            isSet: false,
            socketId: user_credentials.socketId,
            userData: { isRegistered: false, credentials: user }
          });
        } else {
          callback({
            isSet: true,
            socketId: user_credentials.socketId,
            userData: { isRegistered: true, credentials: user }
          });
        }
      });
  },
  _getUser_ByUserEmail(user_email, callback) {},
  _getAllUsers_ByLocation(locaion_id) {},
  _getUsers_Location(users_id) {},
  _getUsers_Subscription(user_id) {},

  _getAllProudcts(productData, callback) {
    knex
      .select()
      .from("products")
      .then(function(product) {
        callback({
          Error: true,
          socketId: productData.socketId,
          productData: { product }
        });
      })
      .catch(err => {
        callback({ Error: true });
      });
  },

  _getProudct(productData, callback) {
    knex
      .select()
      .from("products")
      .then(function(product) {
        callback({
          socketId: productData.socketId,
          productData: { product }
        });
      })
      .catch(err => {
        callback({ Error: true });
      });
  },

  _putNewProudct(data, callback) {
    let productId = CreateId();
    knex("products")
      .insert({
        product_id: productId,
        name: data.data.name,
        description: data.data.descripion,
        product_price_default: data.data.price,
        product_price_discount: 0.0,
        image: data.data.image,
        is_subscribable: data.data.subscribable,
        is_active: data.data.isActive
      })
      .then(function() {
        knex
          .select()
          .from("products")
          .where("product_id", productId)
          .then(function(product) {
            callback({
              socketId: data.socketId,
              productData: { product }
            });
          });
      });
  },
  _putNewUser(user_credentials, callback) {
    let userId = CreateId();
    knex("nonsubscribers")
      .insert({
        user_name: user_credentials.user.fname,
        user_id: userId,
        email: user_credentials.user.email,
        password: user_credentials.user.password
      })
      .then(function() {
        knex
          .select()
          .from("nonsubscribers")
          .where("user_id", userId)
          .then(function(user) {
            callback({
              socketId: user_credentials.socketId,
              userData: { isRegistered: true, credentials: user }
            });
          });
      });
  },
  _removeItem(id, callback) {
    knex("products")
      .where("product_id", id)
      .del()
      .then(function() {
        knex
          .select()
          .from("products")
          .then(function(removed) {
            callback({ Error: false, Data: removed });
          });
      })
      .catch(err => {
        callback({ Error: true });
      });
  },

  _update(id, callback) {
    if (id.data.isImageChaged) {
      knex("products")
        .where("product_id", id.data.id)
        .update({
          name: id.data.name,
          description: id.data.descripion,
          image: id.data.image,
          updated_at: knex.fn.now()
        })
        .then(function() {
          knex
            .select()
            .from("products")
            .then(function(products) {
              callback({
                socketId: id.socketId,
                productData: { products }
              });
            });
        });
    } else {
      knex("products")
        .where("id", id.data.id)
        .update({
          name: id.data.name,
          description: id.data.descripion,
          updated_at: knex.fn.now()
        })   
        .then(function() {
          knex
            .select()
            .from("products")
            .then(function(products) {
              callback({
                socketId: id.socketId,
                productData: { products }
              });
            });
        });
    }
  }
};
