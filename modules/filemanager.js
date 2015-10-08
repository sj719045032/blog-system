/**
 * Created by Administrator on 2015/10/1.
 */
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

function FileManager(storeName, originName, upLoadUserName, path) {
    this.storeName = storeName,
        this.originName = originName,
        this.path = path,
        this.upLoadUserName = upLoadUserName
}
module.exports = FileManager;
FileManager.prototype.save = function (cb) {

    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "-" + (date.getMonth() + 1),
        day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
        minute: date.getFullYear() + "-" + ( date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()),

    };
    var downloadfile = {
        storeName: this.storeName,
        originName: this.originName,
        path: this.path,
        upLoadUserName: this.upLoadUserName,
        uploadTime: time.minute
    }
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('files', function (err, collection) {
            cb(err, collection, db);
        });
    }, function (collection, db, cb) {
        collection.insert(downloadfile, {safe: true}, function (err) {
            cb(err, db);
        })
    }], function (err, db) {
        pool.release(db);
        cb(err);
    });
};

FileManager.getOne = function (storeName, cb) {
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db)
        });
    }, function (db, cb) {
        db.collection('files', function (err, collection) {
            cb(err, collection, db);
        });
    }, function (collection, db, cb) {
        collection.findOne({storeName: storeName}, function (err, fileMessage) {
            cb(err, fileMessage, db);
        });
    }], function (err, fileMessage, db) {
        pool.release(db);
        cb(err, fileMessage);
    });
};

FileManager.getSome = function (upLoadUserName, page, number, callback) {

    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('files', function (err, collection) {
            cb(err, collection, db);

        });
    }, function (collection, db, cb) {
        var query = {};
        if (upLoadUserName) {
            query.upLoadUserName = upLoadUserName;
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

FileManager.getTotalNumber = function (name, callback) {
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('files', function (err, collection) {
            cb(err, collection, db);
        });
    }, function (collection, db, cb) {
        var query = {};
        if (name) {
            query.upLoadUserName = name;
        }

        collection.count(query, function (err, total) {
            cb(err, total, db);
        });
    }], function (err, total, db) {
        pool.release(db);
        callback(err, total);
    });

};
FileManager.remove = function (storename, callback) {
    async.waterfall([function (cb) {
        pool.acquire(function (err, db) {
            cb(err, db);
        });
    }, function (db, cb) {
        db.collection('files', function (err, collection) {
            cb(err, collection, db);
        });
    }, function (collection, db, cb) {
        var query = {
            storeName: storename

        };

        collection.remove(query, {w: 1}, function (err) {
            cb(err, db);
        });
    }], function (err, db) {
        pool.release(db);
        callback(err);
    });
};











