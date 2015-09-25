/**
 * Created by shijin on 2015/9/24.
 */
var express = require('express');
var router = express.Router();

/* GET user page. */
router.get('/', function (req, res, next) {
    res.render("users", {username: "不存在"})
});
router.get('/:username', function (req, res, next) {
    res.render("users", {username: req.params.username})
});

module.exports = router;