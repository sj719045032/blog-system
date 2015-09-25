var express = require('express');
var router = express.Router();
var Post = require('../modules/post.js');
/* GET home page. */
router.get('/', function (req, res, next) {
    var posts;
    Post.get(null, function (err, posts) {
        if (err)
            posts = [];
        res.render('index', {
            title: '主页',
            user: req.session.user,
            posts: posts,
            error: req.flash('error').toString(),
            success: req.flash('success').toString()
        });
    })

});

module.exports = router;
