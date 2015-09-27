var express = require('express');
var router = express.Router();
var Post = require('../modules/post.js');
/* GET home page. */
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



               res.render('index', {
                   title: '主页',
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
