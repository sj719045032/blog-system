/**
 * Created by shijin on 2015/9/24.
 */
var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../modules/user');
var stateCheck = require('../modules/statecheck');
/*
 获取注册页
 */
router.get('/', stateCheck.checkNotLogin
);
router.get('/', function (req, res, next) {
    res.render('reg', {
        user: req.session.user,
        error: req.flash('error').toString(),
        success: req.flash('success').toString()
    });
});

/* 提交注册信息 */
router.post('/', stateCheck.checkNotLogin
);
router.post('/', function (req, res, next) {
    if (req.body['password'] != req.body['rpassword']) {
        req.flash('error', '两次输入的密码不一致!');
        return res.redirect('/reg');//返回注册页
    }
//生成密码散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    /*var password = req.body.password;*/
    var newUser = new User({name: req.body.username, password: password});

//检查用户名是否存在

    User.get(newUser.name, function (err, user) {
        if (user) {
            err = "用户名已存在"
        }
        if (err) {
            console.log(err);
            req.flash('error', err);
            return res.redirect('/reg');
        }

        newUser.save(function (err) {
            if (err) {
                console.log(err);
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', "注册成功！");
            return res.redirect('/');
        })

    })
});


module.exports = router;