/**
 * Created by shijin on 2015/9/26.
 */

var express = require('express');
var router = express.Router();
var stateCheck = require('../modules/statecheck');
var Post = require('../modules/post.js');
router.get('/:name/:day/:title', stateCheck.checkLogin);
router.get('/:name/:day/:title',function(req,res,next){
    var currentUser = req.session.user;
    Post.remove(currentUser.name, req.params.day, req.params.title, function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        req.flash('success', '删除成功!');
        res.redirect('/');
    });
});

module.exports=router;