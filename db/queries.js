const knex = require("./knex"); // the connection!
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
  }
};
