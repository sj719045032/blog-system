/**
 * Created by shijin on 2015/9/24.
 */
var express = require('express');
var router = express.Router();
var stateCheck = require('../modules/statecheck');
var User = require('../modules/user');
var Post = require('../modules/post.js');
/* GET user page. */
router.get('/', function (req, res, next) {
    res.redirect('back');
});
router.get('/:username', stateCheck.checkLogin);
router.get('/:username', function (req, res, next) {
   User.get(req.params.username, function (err,user) {
       if(!user)
       {
           req.flash('error','用户不存在！');
           return res.redirect('/');
       }
       var page = req.query.p ? req.query.p : 1;
       page = parseInt(page);
       var number=5;
       Post.getTotalNumber(null, function (err, total) {
           if (page > Math.ceil(total /number) || page <= 0||isNaN(page))
               page=1;

           Post.getSome(null, page,number, function (err, posts) {
               if (err)
                   posts = [];
               if(posts)
                   res.render('users', {
                       title: '用户页',
                       user: req.session.user,
                       page: page,
                       isFirstPage: page == 1,
                       isLastPage: ((page - 1) * number + posts.length) == total,
                       posts: posts,
                       total: Math.ceil(total /number),
                       type: "user",
                       error: req.flash('error').toString(),
                       success: req.flash('success').toString()
                   });
           })
       });


   });

});
router.get('/p/:_id', stateCheck.checkLogin);
router.get('/p/:_id', function (req, res) {
    Post.getOne(req.params._id.toString().trim(), function (err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        if(!post){
            res.status( 500);
            res.render('error', {
                message:'此文章不存在！',
                error: {status:404,stack:''}
            });
        }
         else
        res.render('article', {
            title: req.params.title,
            post: post,
            user: req.session.user,
            type: "user",
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        });
    });
});
router.post('/attention', stateCheck.checkLogin);
router.get('/attention/:attentionName', function (req, res) {
      User.attention(req.session.user.name,req.params.attentionName.toString().trim(), function (err) {
          if(err)
          res.send(err);
          res.send('关注成功!');
      });
});
module.exports = router;