/**
 * Created by shijin on 2015/9/26.
 */
var express = require('express');
var router = express.Router();
var stateCheck = require('../modules/statecheck');
var Post = require('../modules/post.js');
router.get('/:name/:day/:title', stateCheck.checkLogin);
router.get('/:name/:day/:title', function (req, res, next) {
    var currentUser = req.session.user;
    Post.getOne(currentUser.name, req.params.day, req.params.title, function (err, doc) {
    if(err){
        req.flash('error', err);
        return res.redirect('back');
    }
        res.render('edit',{
            title: '编辑',
            post: doc,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});
router.post('/:name/:day/:title', stateCheck.checkLogin);
router.post('/:name/:day/:title', function (req, res, next) {
    var currentUser = req.session.user;
    Post.update(currentUser.name, req.params.day, req.params.title, req.body.post,function (err) {
        var url = encodeURI('/users/' + req.params.name + '/' + req.params.day + '/' + req.params.title);
        if(err){
            req.flash('error', err);
            return res.redirect(url);
        }
        req.flash('success', '修改成功!');
        res.redirect(url);
    });

});
module.exports = router;