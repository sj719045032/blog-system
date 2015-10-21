/**
 * Created by shijin on 2015/9/25.
 */
/*
 �û�ģ��
 */
var Db = require('./db');
var poolModule = require('generic-pool');
var async = require('async');
var pool = poolModule.Pool({
    name: 'mongoPool_user',
    create: function (cb) {
        var mongoDb = Db();

        mongoDb.open(function (err, db) {
            mongoDb.authenticate("sj719045032", "shijin821", function () {
                cb(err, db);
            });

        });
    },
    destroy: function (mongodb) {
        mongodb.close();
    },
    max: 100,
    min: 5,
    idleTimeoutMills: 30000,
    log: false
});
function User(user) {
    this.name = user.name;
    this.password = user.password;
}

module.exports = User;
/*User.prototype.save = function (callback) {
 var user = {
 name: this.name,
 password: this.password
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

 };*/

User.prototype.save = function (callback) {

    var user = {
        name : this.name,
        password : this.password,
        attention : [],
        by_attention : [],
        article_number : 0
    };

    async.waterfall([
        function (cb) {

            pool.acquire(function (err, db) {
                cb(err, db);

            });
        }, function (db, cb) {
            db.collection('users', function (err, collection) {

                cb(err, collection, db);
            });

        }

        , function (collection, db, cb) {
            collection.ensureIndex('name', {unique: true});
            collection.insert(user, {safe: true}, function (err, user) {
                cb(err, user, db);
            });
        }], function (err, user, db) {
        pool.release(db);
        callback(err, user);

    });

};
/*User.get = function get(username, callback) {
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

 };*/

User.get = function (username, callback) {
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('users', function (err, collection) {
            cb(err, collection, db);
        })
    },
        function (collection, db, cb) {
            collection.findOne({name: username}, function (err, user) {
                cb(err, user, db);
            });
        }

    ], function (err, user, db) {
        pool.release(db);
        callback(err, user);

    });
};
User.attention= function (username,attentionName, callback) {
   async.waterfall([function (cb) {
       pool.acquire(function (err, db) {
           cb(err,db);
       });
   }, function (db, cb) {
       db.collection('users', function (err, collection) {
           cb(err,collection,db);
       });
   }, function (collection, db, cb) {
       collection.update({name:username},{$addToSet:{attention:attentionName}}, function (err) {
           cb(err,collection,db);
       });

   }, function (collection, db, cb) {

       collection.update({name:attentionName},{$addToSet:{by_attention:username}}, function (err) {
           cb(err,db);
       });
   }],function(err,db){
       pool.release(db);
       callback(err);
   });
};

User.removeAttention= function (username,attentionName, callback) {
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err,db);
        });
    }, function (db, cb) {
        db.collection('users', function (err, collection) {
            cb(err,collection,db);
        });
    }, function (collection, db, cb) {
        collection.update({name:username},{$pull:{attention:attentionName}}, function (err) {
            cb(err,collection,db);
        });

    }, function (collection, db, cb) {
        collection.update({name:attentionName},{$pull:{by_attention:username}}, function (err) {
            cb(err,db);
        });
    }
    ],function(err,db){
        pool.release(db);
        callback(err);
    });
};