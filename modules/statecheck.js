/**
 * Created by shijin on 2015/9/25.
 */
exports.checkLogin = function (req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登录！');
        res.redirect('/login');
    }
    next();
};

exports.checkNotLogin = function (req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登录!');
        res.redirect('/');
    }
    next();
};