/**
 * Created by shijin on 2015/9/25.
 */
var mongooseDb = require('./mongooseDb');
function User(user) {
    this.name = user.name;
    this.password = user.password;
}
module.exports = User;
var UserSchema = new mongooseDb.mongoose.Schema({
    name: String,
    password: String,
    attention: Array,
    by_attention: Array,
    article_number: Number
});
var UserModel = mongooseDb.db.model('users', UserSchema);
User.prototype.save = function (callback) {

    var user = {
        name: this.name,
        password: this.password,
        attention: [],
        by_attention: [],
        article_number: 0
    };

    var userEntity = new UserModel(user);
    userEntity.save(function (err) {
        callback(err);
    });

};

User.get = function (username, callback) {

    UserModel.findOne({name: username}, function (err, user) {
        callback(err, user);
    });
};


User.attention = function (username, attentionName, callback) {

    UserModel.update({name: username}, {$addToSet: {attention: attentionName}}, function (err) {
        if (err)
            callback(err);
        UserModel.update({name: attentionName}, {$addToSet: {by_attention: username}}, function (err) {
            callback(err);
        });
    });
};

User.removeAttention = function (username, attentionName, callback) {

    UserModel.update({name: username}, {$pull: {attention: attentionName}}, function (err) {
        if (err)
            callback(err);
        UserModel.update({name: attentionName}, {$pull: {by_attention: username}}, function (err) {
            callback(err);
        });
    });


};