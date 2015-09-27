/**
 * Created by shijin on 2015/9/26.
 */

var express = require('express');
var router = express.Router();
var stateCheck = require('../modules/statecheck');
var Post = require('../modules/post.js');
router.get('/:_id', stateCheck.checkLogin);
router.get('/:_id', function (req, res) {
    var currentUser = req.session.user;
    Post.getOne(req.params._id, function (err, doc) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        if (doc.name != currentUser.name)
            return res.redirect('back');
        Post.remove(req.params._id, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '删除成功!');
            res.redirect('/');
        });
    });
});

module.exports=router;