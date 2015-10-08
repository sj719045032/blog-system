var express = require('express');
var router = express.Router();
var Post = require('../modules/post.js');
var stateCheck = require('../modules/statecheck');
/* GET home page. */
router.get('/', stateCheck.checkLogin);
router.get('/', function (req, res) {
    var page = req.query.p ? req.query.p : 1;
    var number=10;
   Post.getTotalNumber(null, function (err, total) {
      if (page > Math.ceil(total /number) || page <= 0||isNaN(page))
          page=1;
       page = parseInt(page);
       Post.getSome(null, page,number, function (err, posts) {
           if (err)
               posts = [];
           if(posts)



               return res.render('index', {
                   title: '主页',
                   type: 'index',
                   user: req.session.user,
                   page: page,
                   isFirstPage: page == 1,
                   isLastPage: ((page - 1) * 10 + posts.length) == total,
                   posts: posts,
                   total: Math.ceil(total /number),
                   error: req.flash('error').toString(),
                   success: req.flash('success').toString()
               });
       })
   });


});

module.exports = router;
