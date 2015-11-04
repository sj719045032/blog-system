/**
 * Created by shijin on 2015/11/2.
 */
var express = require('express');
var router = express.Router();
var Post = require('../modules/post.js');
var stateCheck = require('../modules/statecheck');
router.get('/:_id', stateCheck.checkLogin);
router.get('/:_id', function (req, res) {
            contentGet(req,res);
});
router.post('/:_id', stateCheck.checkLogin);
router.post('/:_id', function (req, res) {
    switch (req.body._method) {
        case 'get':
            contentGet(req,res);
            break;
        case 'update':
            contentUpdate(req,res);
            break;
        case 'delete':
            contentDelete(req,res);
            break;
        case 'post':
            contentPost(req,res);
            break;
        case 'reprint':
            contentReprint(req,res);
            break;
    }


});
var contentGet=function (req, res) {
    Post.getOne(req.params._id.toString().trim(), function (err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        if (!post) {
            res.status(500);
            res.render('error', {
                message: '此文章不存在！',
                error: {status: 404, stack: ''}
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

};
var contentPost=function (req, res) {
    var user = req.session.user;
    var post = new Post(user.name, req.body.title, req.body.content, req.body.img);
    post.save(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', '发表成功');
        return res.redirect('back');
    });
};
var contentDelete=function (req, res) {
    var currentUser = req.session.user;
    Post.getOne(req.params._id, function (err, doc) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        if (doc)
            if (doc.name != currentUser.name)
                return res.redirect('back');
        Post.remove(req.params._id, function (err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '删除成功!');
            return res.redirect('/');
        });
    });
};
var contentUpdate=function (req, res) {
    var currentUser = req.session.user;
    Post.getOne(req.params._id, function (err, doc) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        if (doc.name != currentUser.name)
            return res.redirect('back');


        Post.update(req.params._id, req.body.content, function (err) {
            var url = encodeURI('/content/' + req.params._id);
            if (err) {
                req.flash('error', err);
                return res.redirect(url);
            }
            req.flash('success', '修改成功!');
            res.redirect(url);
        });
    });
};
var contentReprint= function (req, res) {
    Post.getOne(req.params._id.toString().trim(), function (err, post) {
        if (err) {
            req.flash('error', err);
            return res.redirect(back);
        }
        var currentUser = req.session.user,
            reprint_from = {name: post.name, day: post.time.day, title: post.title,_id:post._id},
            reprint_to = {name: currentUser.name, head: currentUser.head};
        Post.reprint(reprint_from, reprint_to, function (err, post) {
            if (err) {
                req.flash('error', err);
                return res.redirect('back');
            }
            req.flash('success', '转载成功!');
            var url = encodeURI('/users/p/' + post._id);
            res.redirect(url);
        });
    });
}
module.exports = router;