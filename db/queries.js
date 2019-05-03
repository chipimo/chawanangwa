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
        image: data.img.url,
        public_id: data.img.public_id,
        format: data.img.format,
        ImgUrl: data.img.url,
        secure_url: data.img.secure_url,
        is_subscribable: data.data.subscribable,
        is_active: data.data.isActive
      })
      .then(function() {
        knex
          .select()
          .from("products")
          .then(function(product) {
            callback({
              socketId: data.socketId,
              productData: { product }
            });
          });
      });
  },

  _putNewNewBundle(data, callback) {
    knex
      .select()
      .from("subscriptions")
      .then(function(Bundle) {
        if (Bundle.length === 0) {
          knex("subscriptions")
            .insert({
              contener: { main: data.contener }
            })
            .then(function() {
              knex
                .select()
                .from("subscriptions")
                .then(function(Bundle) {
                  callback({
                    // socketId: BundleData.socketId,
                    BundleData: { Bundle }
                  });
                })
                .catch(err => {
                  callback({ Error: true });
                });
            });
        } else {
          knex("subscriptions")
            .update({
              contener: knex.raw(`jsonb_set(??, '{main}', ?)`, [
                "contener",
                { main: data.contener }
              ])
            })
            .then(function() {
              knex
                .select()
                .from("subscriptions")
                .then(function(Bundle) {
                  callback({
                    // socketId: BundleData.socketId,
                    BundleData: { Bundle }
                  });
                })
                .catch(err => {
                  callback({ Error: true });
                });
            });
        }
      })
      .catch(err => {
        callback({ Error: true });
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
            callback({ Error: false, Data: {removed} });
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
          image: id.img.url,
          product_price_discount: id.data.discount,
          product_price_default: id.data.price,
          is_subscribable: id.data.isSub,
          updated_at: id.data.updated_at
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
        .where("product_id", id.data.id)
        .update({
          name: id.data.name,
          description: id.data.descripion,
          product_price_discount: id.data.discount,
          product_price_default: id.data.price,
          is_subscribable: id.data.isSub,
          updated_at: id.data.updated_at
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
