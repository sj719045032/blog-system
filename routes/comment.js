/**
 * Created by shijin on 2015/9/26.
 */
var express = require('express');
var router = express.Router();
var stateCheck = require('../modules/statecheck');
var Comment=require('../modules/comment.js');
router.post('/:name/:day/:title', function (req, res, next) {
    var date = new Date(),
        time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
            date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    var comment = {
        name: req.session.user.name?req.session.user.name:"",
        email: req.body.email,
        website: req.body.website,
        time: time,
        content: req.body.content
    };
    var newComment = new Comment(req.params.name, req.params.day, req.params.title, comment);
    newComment.save(function (err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
        req.flash('success', 'ÁôÑÔ³É¹¦!');
        res.redirect('back');
    });
});

module.exports = router;