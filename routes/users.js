/**
 * Created by shijin on 2015/9/24.
 */
var express = require('express');
var router = express.Router();
var User = require('../modules/user');
var Post = require('../modules/post.js');
/* GET user page. */
router.get('/', function (req, res, next) {
    res.redirect('back');
});
router.get('/:username', function (req, res, next) {
   User.get(req.params.username, function (err,user) {
       if(!user)
       {
           req.flash('error','用户不存在！');
           return res.redirect('/');
       }
       Post.getAll(user.name, function (err, posts) {
           if(err)
           {
               req.flash('error',err);
               return res.redirect('/');
           }

           res.render('users',{
               title: user.name,
               posts: posts,
               user : req.session.user,
               success : req.flash('success').toString(),
               error : req.flash('error').toString()
           });
       })

   });

});
router.get('/:name/:day/:title', function (req, res) {
    Post.getOne(req.params.name, req.params.day, req.params.title, function (err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        res.render('article', {
            title: req.params.title,
            post: post,
            user: req.session.user,
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});
module.exports = router;