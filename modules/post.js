/**
 * Created by shijin on 2015/9/25.
 */
/*
 ÎÄÕÂÄ£ÐÍ
 */
var ObjectID = require('mongodb').ObjectID;
var Db = require('./db');
var poolModule = require('generic-pool');
var async = require('async');
var pool = poolModule.Pool({
    name: 'mongoPool_post',
    create: function (cb) {
        var mongoDb = Db();
        mongoDb.open(function (err, db) {
            cb(err, db);
        })
    },
    destroy: function (mongodb) {
        mongodb.close();
    },
    max: 100,
    min: 5,
    idleTimeoutMills: 30000,
    log: false
});
function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}

module.exports = Post;

/*Post.prototype.save = function (callback) {

 var date = new Date();
 var time = {
 date: date,
 year: date.getFullYear(),
 month: date.getFullYear() + "-" + (date.getMonth() + 1),
 day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
 minute: date.getFullYear() + "-" + ( date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()),

 };
 var post = {
 name: this.name,
 time: time,
 title: this.title,
 post: this.post,
 comments: []
 };

 pool.acquire(function (err, db) {
 if (err)
 return callback(err);
 db.collection('posts', function (err, collection) {
 if (err) {
 pool.release(db);
 return callback(err);
 }

 collection.insert(post, {safe: true}, function (err) {
 pool.release(db);
 if (err) {
 return callback(err);
 }
 callback(null);
 })
 })

 })
 };*/
Post.prototype.save = function (callback) {

    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + ( date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()),

    };
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post,
        comments: []
    };
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('posts', function (err, collection) {
            cb(err, collection, db);

        });
    }, function (colletion, db, cb) {
        colletion.insert(post, {safe: true}, function (err) {
            cb(err, db);
        });
    }
    ], function (err, db) {
        pool.release(db);
        callback(err);
    });

};
/*Post.getSome = function (name, page, number, callback) {
 pool.acquire(function (err, db) {
 if (err) {
 pool.release(db);
 return callback(err);
 }
 db.collection('posts', function (err, collection) {
 if (err) {
 pool.release(db);
 return callback(err);
 }

 var query = {};
 if (name) {
 query.name = name;
 }


 collection.find(query, {
 skip: (page - 1) * number,
 limit: number
 }).sort({time: -1}).toArray(function (err, docs) {
 pool.release(db);
 if (err)
 callback(err);
 callback(null, docs);
 });


 });

 });
 };*/

Post.getSome = function (name, page, number, callback) {

    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('posts', function (err, collection) {
            cb(err, collection, db);

        });
    }, function (collection, db, cb) {
        var query = {};
        if (name) {
            query.name = name;
        }
        collection.find(query, {
            skip: (page - 1) * number,
            limit: number
        }).sort({time: -1}).toArray(function (err, docs) {
            cb(err, docs, db);
        })
    }], function (err,docs, db) {
        pool.release(db);
        callback(err, docs);
    });

};
/*
 Post.getOne = function (_id, callback) {
 pool.acquire(function (err, db) {
 if (err) {
 pool.release(db);
 return callback(err);
 }
 db.collection('posts', function (err, collection) {
 if (err) {
 pool.release(db);
 return callback(err);
 }

 var query = {
 '_id': new ObjectID(_id)

 };


 collection.findOne(query, function (err, doc) {

 pool.release(db);
 if (err)
 return callback(err);

 callback(null, doc);
 })

 })

 });
 };
 */

Post.getOne = function (_id, callback) {
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('posts', function (err, collection) {

            cb(err, collection, db);
        })
    }, function (collection, db, cb) {
        var query = {
            '_id': new ObjectID(_id)
        };
        collection.findOne(query, function (err, doc) {
            cb(err, doc, db);
        })

    }], function (err, doc, db) {
        pool.release(db);
        callback(err, doc);
    });
};
/*Post.update = function (_id, post, callback) {
 pool.acquire(function (err, db) {
 if (err) {
 pool.release(db);
 return callback(err);
 }
 db.collection('posts', function (err, collection) {
 if (err) {
 pool.release(db);
 return callback(err);
 }

 var query = {
 '_id': new ObjectID(_id)

 };


 collection.update(query, {
 $set: {post: post}
 }, function (err) {

 pool.release(db);
 if (err)
 return callback(err);

 callback(null);
 })

 })

 });
 };*/
Post.update = function (_id, post, callback) {
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('posts', function (err, collection) {
            cb(err, collection, db);
        });
    }, function (collection, db, cb) {
        var query = {
            '_id': new ObjectID(_id)
        };
        collection.update(query, {
            $set: {post: post}
        }, function (err) {
            cb(err, db);
        });
    }], function (err, db) {
        pool.release(db);
        callback(err);
    });
};
/*Post.getTotalNumber = function (name, callback) {
 pool.acquire(function (err, db) {
 if (err) {
 pool.release(db);
 return callback(err);
 }
 db.collection('posts', function (err, collection) {
 if (err) {
 pool.release(db);
 return callback(err);
 }

 var query = {};
 if (name) {
 query.name = name;
 }

 collection.count(query, function (err, total) {
 pool.release(db);
 if (err) {

 callback(err)
 }

 callback(null, total);

 });

 });

 });
 };*/
Post.getTotalNumber = function (name, callback) {
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('posts', function (err, collection) {
            cb(err, collection, db);
        });
    }, function (collection, db, cb) {
        var query = {};
        if (name) {
            query.name = name;
        }

        collection.count(query, function (err, total) {
            cb(err, total, db);
        });
    }], function (err, total, db) {
        pool.release(db);
        callback(err, total);
    });

};
/*
 Post.remove = function (_id, callback) {
 pool.acquire(function (err, db) {
 if (err) {
 pool.release(db);
 return callback(err);
 }
 db.collection('posts', function (err, collection) {
 if (err) {
 pool.release(db);
 return callback(err);
 }

 var query = {
 '_id': new ObjectID(_id)

 };


 collection.remove(query, {w: 1}, function (err) {

 pool.release(db);
 if (err)
 return callback(err);

 callback(null);
 })

 })

 });
 };*/

Post.remove = function (_id, callback) {
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('posts', function (err, collection) {
            cb(err, collection, db);
        });
    }, function (collection, db, cb) {
        var query = {
            '_id': new ObjectID(_id)

        };
        collection.remove(query, {w: 1}, function (err) {
            cb(err,db);
        });
    }], function (err, db) {
        pool.release(db);
        callback(err);
    });

};
