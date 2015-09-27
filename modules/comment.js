/**
 * Created by shijin on 2015/9/26.
 */
var Db = require('./db');
var poolModule = require('generic-pool');
var pool = poolModule.Pool({
    name: 'mongoPool_comment',
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
    log: true
});
function Comment(name,day,title,comment){
    this.name = name;
    this.day = day;
    this.title = title;
    this.comment = comment;
};

module.exports = Comment;

Comment.prototype.save=function(callback){
    var name = this.name,
        day = this.day,
        title = this.title,
        comment = this.comment;
    pool.acquire(function (err, db) {
        if(err)
        return callback(err);

        db.collection('posts',function(err,collection){
            if(err){
                pool.release();
                return callback(err);
            }
            var query={
                'name':name,
                'time.day':day,
                'title':title
            }
            collection.update(query,{$push:{comments:comment}}, function (err) {
                if(err)
                {
                    mongodb.close();
                    callback(err);
                }
                callback(null);
            })
        });
    });
};