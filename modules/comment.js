/**
 * Created by shijin on 2015/9/26.
 */
var mongodb = require('./db');
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
    mongodb.open(function (err, db) {
        if(err)
        return callback(err);

        db.collection('posts',function(err,collection){
            if(err){
                mongodb.close();
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