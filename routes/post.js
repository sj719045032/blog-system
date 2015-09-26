/**
 * Created by shijin on 2015/9/24.
 */
var express = require('express');
var router = express.Router();
var stateCheck = require('../modules/statecheck');
var Post = require('../modules/post.js');
var formidable = require('formidable');
var fs=require('fs');
/* 获取发表页
* */
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

        req.flash('sucess', '发表成功');
        res.redirect('/');
    });
});
router.post('/img', stateCheck.checkLogin);
router.post('/img', function (req, res, next) {
        var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + '/../public/img';
    form.parse(req, function (err, fields, files) {
        if (err)
            throw err;

        var image = files.imgFile;
        var path = image.path;
        var type = image.type;
        type = type.substr(0, type.indexOf('/'));
        console.log(files);
        if (type!="image") {
            var info = {
                "error": 1,
                "message": "请上传图片"
            };
            fs.unlink(path);
           return res.send(info);
        }
        path = path.replace('/\\/g', '/');
        var url = '/img' + path.substr(path.lastIndexOf('\\'), path.length);

        var info = {
            "error": 0,
            "url": url
        };
        res.send(info);
    });


});
module.exports = router;