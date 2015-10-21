/**
 * Created by Administrator on 2015/10/2.
 */
var express = require('express');
var router = express.Router();
var stateCheck = require('../modules/statecheck');
var FileManager = require('../modules/filemanager.js');
router.get('/', stateCheck.checkLogin);
router.get('/', function (req, res) {
    var page = req.query.p ? req.query.p : 1;
    var number = 10;
    var user = req.session.user;
    FileManager.getTotalNumber(user.name, function (err, total) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        page = parseInt(page);
        FileManager.getSome(user.name, page, number, function (err, filelist) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('filemanage', {
                title: '文件管理',
                user: req.session.user,
                page: page,
                isFirstPage: page == 1,
                isLastPage: ((page - 1) * number + filelist.length) == total,
                filelist: filelist,
                total: Math.ceil(total / number),
                error: req.flash('error').toString(),
                success: req.flash('success').toString(),
                type: 'filemanage'
            });

        });
    });

});
router.get('/d/:storeName', function (req, res) {
    FileManager.getOne(req.params.storeName, function (err, file) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }

        res.download(file.path, file.originName);
    });

});
module.exports = router;