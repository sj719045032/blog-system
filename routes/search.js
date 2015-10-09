/**
 * Created by shijin on 2015/9/28.
 */
var express = require('express');
var router = express.Router();
var Post = require('../modules/post.js');
router.get('/', function (req, res) {
    Post.search(req.query.keyword, function (err, posts) {
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        console.log(posts[0]);

        res.render('search', {
            title: "SEARCH:" + req.query.keyword,
            posts: posts,
            user: req.session.user,
            type:"",
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

    });
});
module.exports=router;