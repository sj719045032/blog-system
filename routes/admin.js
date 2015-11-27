/**
 * Created by shijin on 2015/11/26.
 */
var express = require("express");
var router = express.Router();
var Post = require("../modules/post.js");
var User = require("../modules/user.js");
router.get("/", function (req, res) {
    return res.render("admin");
});

router.get("/content", function (req, res) {
    var page = req.query.p || 1;
    var number = 10;
    Post.getTotalNumber(null, function (err, total) {
        if (page > Math.ceil(total / number) || page <= 0 || isNaN(page))
            page = 1;
        page = parseInt(page);
        Post.getSome(null, page, number, function (err, posts) {
            if (err)
                posts = [];
            if (posts)
                return res.send({posts:posts,total: Math.ceil(total / number)});
        })
    });

});
router.delete("/content/:_id", function (req, res) {

        Post.remove(req.params._id, function (err) {
            if (err) {
                return res.status(404).send("not found");
            }
            return res.send("success");
        });

});
module.exports = router;