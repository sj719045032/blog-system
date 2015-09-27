/**
 * Created by shijin on 2015/9/24.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../modules/user');
var stateCheck = require('../modules/statecheck');
/*
 获取登陆页面
 */
router.get('/', stateCheck.checkNotLogin);
router.get('/', function (req, res, next) {
    res.render('login', {
        user: req.session.user,
        error: req.flash('error').toString(),
        success: req.flash('success').toString()
    });
});

/* 登录*/
router.post('/', stateCheck.checkNotLogin);
router.post('/', function (req, res, next) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    /*var password=req.body.password;*/
    User.get(req.body.username, function (err, user) {
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/login');
        }

        if ((user.password + '') != (password + '')) {
            req.flash('error', '密码错误');
            return res.redirect('/login');
            s
        }
        req.session.user = user;
        req.flash('success', '登陆成功!');
        return res.redirect('/');
    });
});

module.exports = router;