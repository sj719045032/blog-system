/**
 * Created by shijin on 2015/9/25.
 */
exports.checkLogin = function (req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

exports.checkNotLogin = function (req, res, next) {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};