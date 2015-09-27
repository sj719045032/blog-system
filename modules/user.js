/**
 * Created by shijin on 2015/9/25.
 */
/*
 用户模型
 */
var Db = require('./db');
var poolModule=require('generic-pool');
var pool=poolModule.Pool({
    name:'mongoPool',
    create: function (cb) {
        var mongoDb=Db();
        mongoDb.open(function (err, db) {
            cb(err,db);
        })
    },
    destroy: function (mongodb) {
        mongodb.close();
    },
    max:100,
    min:5,
    idleTimeoutMills:30000,
    log:true
});
function User(user) {
    this.name = user.name;
    this.password = user.password;
}

module.exports = User;
User.prototype.save = function save(callback) {
    var user = {
        name: this.name,
        password: this.password,
    };
    pool.acquire(function (err, db) {
        if (err) {
           pool.release(db);
            return callback(err);
        }
        db.collection('users', function (err, collection) {
            if (err) {
               pool.release(db);
                return callback(err);
            }
            collection.ensureIndex('name', {unique: true});
            collection.insert(user, {safe: true}, function (err, user) {
               pool.release(db);
                callback(err, user);
            });
        });
    });

};
User.get = function get(username, callback) {
    pool.acquire(function (err, db) {
        if (err)
            return callback(err);
        db.collection('users', function (err, collection) {
            if (err) {
               pool.release(db);
                return callback(err);
            }

            collection.findOne({name: username}, function (err, doc) {
               pool.release(db);
                if (doc) {
                    var user = new User(doc);
                    callback(err, user);
                }
                else
                    callback(err);

            })
        });
    });

};