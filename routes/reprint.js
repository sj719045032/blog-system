/**
 * Created by shijin on 2015/9/29.
 */
var express = require('express');
var router = express.Router();
var Post = require('../modules/post.js');
var stateCheck = require('../modules/statecheck');
router.get('/:_id', stateCheck.checkLogin);
router.get('/:_id', function (req, res) {
    Post.getOne(req.params._id.toString().trim(), function (err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect(back);
        }
        var currentUser = req.session.user,
            reprint_from = {name: post.name, day: post.time.day, title: post.title,_id:post._id},
            reprint_to = {name: currentUser.name, head: currentUser.head};
        Post.reprint(reprint_from, reprint_to, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '转载成功!');
            var url = encodeURI('/users/p/' + post._id);
            res.redirect(url);
        });
    });
});

module.exports=router;