/**
 * Created by shijin on 2015/9/24.
 */
var express = require('express');
var router = express.Router();
var stateCheck = require('../modules/statecheck');
var Post = require('../modules/post.js');
/* 获取发表文章页 */
router.get('/', stateCheck.checkLogin);
router.get('/', function (req, res, next) {
    res.render('post', {
        user: req.session.user,
        error: req.flash('error').toString(),
        success: req.flash('success').toString()
    });
});
router.post('/', stateCheck.checkLogin);
router.post('/', function (req, res, next) {
    var user = req.session.user;
    var post = new Post(user.name, req.body.title, req.body.content);
    post.save(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('post');
        }

        req.flash('sucess', '发表成功！');
        res.redirect('/');
    });
});

module.exports = router;