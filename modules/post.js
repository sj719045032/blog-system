/**
 * Created by shijin on 2015/9/25.
 */
/*
 ����ģ��
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
            mongoDb.authenticate("sj719045032", "shijin821", function () {
                cb(err, db);
            });
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
        pv: 0,
        reprint_info: {},
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
    }], function (err, docs, db) {
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
    try {
        var query = {
            '_id': new ObjectID(_id)
        };
    } catch (err) {
        return callback(null, null);
    }
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('posts', function (err, collection) {

            cb(err, collection, db);
        });
    }, function (collection, db, cb) {


        collection.findOne(query, function (err, doc) {
            cb(err, doc, db, collection);
        });

    }, function (doc, db, collection, cb) {

        collection.update(query, {
            $inc: {"pv": 1}
        }, function (err) {
            cb(err, doc, db);
        });
    }], function (err, doc, db) {
        pool.release(db);
        callback(err, doc);
    });
}
;
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
        collection.findOne(query, function (err, doc) {
            var reprint_from = "";
            if (doc.reprint_info.reprint_from) {
                reprint_from = doc.reprint_info.reprint_from;
            }
            if (reprint_from != "") {
                //更新原文章所在文档的 reprint_to
                collection.update({
                    "_id": reprint_from._id,
                }, {
                    $pull: {
                        "reprint_info.reprint_to": {
                            "name": doc.name,
                            "day": doc.time.day,
                            "title": doc.title
                        }
                    }
                }, function (err) {

                    if (err) {
                        cb(err);
                    }
                });
            }
        });
        collection.remove(query, {w: 1}, function (err) {
            cb(err, db);
        });
    }], function (err, db) {
        pool.release(db);
        callback(err);
    });
};
Post.search = function (keyword, callback) {
    async.waterfall([
        function (cb) {
            pool.acquire(function (err, db) {
                cb(err, db);
            });
        }
        , function (db, cb) {
            db.collection('posts', function (err, collection) {
                cb(err, collection, db);
            });
        }, function (collection, db, cb) {
            var pattern = new RegExp(keyword, 'i');
            collection.find({'title': pattern}, {'name': 1, 'title': 1, 'time': 1}).sort({
                time: -1
            }).toArray(function (err, docs) {
                cb(err, docs, db);
            });
        }], function (err, docs, db) {
        pool.release(db);
        callback(err, docs);
    });
};
Post.reprint = function (rp_from, rp_to, callback) {
    async.waterfall([
        function (cb) {
            pool.acquire(function (err, db) {
                cb(err, db);
            });
        }, function (db, cb) {
            db.collection('posts', function (err, collection) {
                cb(err, collection, db);
            });
        }, function (collection, db, cb) {

            collection.findOne({
                _id: rp_from._id
            }, function (err, doc) {
                cb(err, doc, collection, db);
            });
        }, function (doc, collection, db, cb) {
            var date = new Date();
            var time = {
                date: date,
                year: date.getFullYear(),
                month: date.getFullYear() + "-" + (date.getMonth() + 1),
                day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
                date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
            }
            delete doc._id;
            doc.name = rp_to.name;
            doc.time = time;
            doc.title = (doc.title.search(/[转载]/) > -1) ? doc.title : "[转载]" + doc.title;
            doc.comments = [];
            doc.reprint_info = {"reprint_from": rp_from};
            doc.pv = 0;
            collection.update({
                _id: rp_from._id
            }, {
                $push: {
                    "reprint_info.reprint_to": {
                        "name": doc.name,
                        "day": time.day,
                        "title": doc.title
                    }
                }
            }, function (err) {
                if (err)
                    cb(err, db);
            });

            collection.insert(doc, {
                safe: true
            }, function (err, post) {
                cb(err, db, post.ops[0]);
            });

        }
    ], function (err, db, post) {
        pool.release(db);
        callback(err, post);

    });
};