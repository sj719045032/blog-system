var express = require('express');
var router = express.Router();
var stateCheck = require('../modules/statecheck');
/* 登录退出. */
router.get('/', stateCheck.checkLogin);
router.get('/', function (req, res, next) {
    req.session.user = null;
    req.flash('success', '登出成功');
    return res.redirect('/');
});

module.exports = router;

