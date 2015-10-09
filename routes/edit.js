/**
 * Created by shijin on 2015/9/26.
 */
var express = require('express');
var router = express.Router();
var stateCheck = require('../modules/statecheck');
var Post = require('../modules/post.js');
router.get('/:_id', stateCheck.checkLogin);
router.get('/:_id', function (req, res, next) {
    var currentUser = req.session.user;
    Post.getOne(req.params._id, function (err, doc) {
    if(err){
        req.flash('error', err);
        return res.redirect('back');
    }
        if(!doc)
            return res.redirect('/');
        if (currentUser.name != doc.name)
            return res.redirect('back');
        res.render('edit',{
            title: '编辑',
            post: doc,
            user: req.session.user,
            type:"",
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });

    });
});
router.post('/:_id', stateCheck.checkLogin);
router.post('/:_id', function (req, res, next) {
    var currentUser = req.session.user;
    Post.getOne(req.params._id, function (err, doc) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        if (doc.name != currentUser.name)
            return res.redirect('back');
        Post.update(req.params._id, req.body.post, function (err) {
            var url = encodeURI('/users/p/' + req.params._id);
        if(err){
            req.flash('error', err);
            return res.redirect(url);
        }
        req.flash('success', '修改成功!');
        res.redirect(url);
    });
    });
});
module.exports = router;