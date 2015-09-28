/**
 * Created by shijin on 2015/9/28.
 */
var express = require('express');
var router = express.Router();
var Post = require('../modules/post.js');
router.get('/', function (req, res) {
    console.log(req.query.keyword);
    Post.search(req.query.keyword, function (err, docs) {
        if(err){
            req.flash('error', err);
            return res.redirect('/');
        }
        res.render('search', {
            title: "SEARCH:" + req.query.keyword,
            posts: docs,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

    });
});
module.exports=router;