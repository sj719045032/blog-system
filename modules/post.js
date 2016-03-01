/**
 * Created by shijin on 2015/9/25.
 */
/*
 ����ģ��
 */
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('./mongooseDb');
var async = require('async');

function Post(name, title, post, img) {
    this.name = name;
    this.title = title;
    this.post = post;
    this.img = img;
}

module.exports = Post;

var PostSchema = new mongoose.Schema({
    name: String,
    time: Object,
    title: String,
    post: String,
    pv: Number,
    reprint_info: {reprint_from: {}, reprint_to: Array},
    comments: Array,
    img: Array
});

var PostModel = mongoose.model('posts', PostSchema);
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
        reprint_info: {reprint_from: {index: ""}, reprint_to: []},
        comments: [],
        img: []
    };


    if (this.img)
        if (typeof this.img == "string") {

            post.img.push(JSON.parse(this.img));

        }
        else {
            this.img.forEach(function (img) {
                if (typeof img == 'string') {
                    post.img.push(JSON.parse(img));
                } else {
                    post.img.push(img);
                }
            });
        }
    var PostEntity = new PostModel(post);

    PostEntity.save({safe: true}, function (err) {
        if (err)
            callback(err);
        PostModel.update({name: post.name}, {$inc: {'article_number': 1}}, function (err) {
            callback(err);
        });

    });

};

Post.getSome = function (name, page, number, callback) {

    var page = page ? page : 1;
    var query = {};
    if (name) {
        query.name = name;
    }
    PostModel.find(query).sort({time: -1}).limit(number).skip((page - 1) * number).exec(function (err, docs) {
        callback(err, docs);
    })


};
Post.getOne = function (_id, callback) {
    try {
        var query = {
            '_id': new ObjectID(_id)
        };
    } catch (err) {
        return callback(null, null);
    }


    PostModel.findOne(query, function (err, doc) {
        if (err)
            callback(err);
        PostModel.update(query, {
            $inc: {"pv": 1}
        }, function (err) {
            callback(err, doc);
        });
    });

}
;

Post.update = function (_id, post, callback) {
    try {
        var query = {
            '_id': new ObjectID(_id)
        };
    } catch (err) {
        return callback(null, null);
    }
    PostModel.update(query, {
        $set: post
    }, function (err) {
        callback(err);
    });
};

Post.getTotalNumber = function (name, callback) {

    var query = {};
    if (name) {
        query.name = name;
    }

    PostModel.count(query, function (err, total) {
        callback(err, total);
    });

};
Post.remove = function (_id, callback) {
    async.waterfall([
            function (cb) {
                var query = {
                    '_id': new ObjectID(_id)

                };
                PostModel.findOne(query, function (err, doc) {
                    if (doc.reprint_info.reprint_from)
                        PostModel.update({
                            "_id": doc.reprint_info.reprint_from._id
                        }, {
                            $pull: {
                                "reprint_info.reprint_to": {
                                    "name": doc.name,
                                    "day": doc.time.day,
                                    "title": doc.title
                                }
                            }
                        }, function (err) {
                            if (err)
                                cb(err);

                        });
                    PostModel.remove(query, function (err) {
                        cb(err, doc);
                    });


                });
            }, function (doc, cb) {
                PostModel.update({username: doc.name}, {$inc: {'article_number': -1}}, function (err) {
                    cb(err);
                });

            }
        ],
        function (err) {
            callback(err);
        });
};
Post.search = function (keyword, callback) {

    var pattern = new RegExp(keyword, 'i');
    PostModel.find({'title': pattern}, {'name': 1, 'title': 1, 'time': 1}).sort({
        time: -1
    }).exec(function (err, docs) {
        callback(err, docs);
    });

};
Post.reprint = function (rp_from, rp_to, callback) {
    async.waterfall([
        function (cb) {

            PostModel.findOne({
                _id: rp_from._id
            }, function (err, doc) {
                cb(err, doc);
            });
        }, function (doc, cb) {
            var date = new Date();
            var time = {
                date: date,
                year: date.getFullYear(),
                month: date.getFullYear() + "-" + (date.getMonth() + 1),
                day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
                minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
                date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
            };
            var newdoc = {
                name: rp_to.name,
                time: time,
                title: (doc.title.search(/[转载]/) > -1) ? doc.title : "[转载]" + doc.title,
                post: doc.post,
                pv: 0,
                reprint_info: {reprint_from: rp_from, reprint_to: []},
                comments: [],
                img: doc.img

            };
            PostModel.update({
                _id: rp_from._id
            }, {
                $push: {
                    "reprint_info.reprint_to": {
                        "name": newdoc.name,
                        "day": newdoc.time.day,
                        "title": newdoc.title
                    }
                }
            }, function (err) {
                if (err)
                    cb(err);
            });
            var PostEntity = new PostModel(newdoc);
            PostEntity.save({
                safe: true
            }, function (err, post) {
                cb(err, post);
            });

        }
    ], function (err, post) {
        callback(err, post);

    });
};