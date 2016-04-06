/**
 * Created by shijin on 2015/11/18.
 */
/**
 * Created by shijin on 2015/9/24.
 */
var express = require('express');
var router = express.Router();
var stateCheck = require('../modules/statecheck');
var User = require('../modules/user.js');
var formidable = require('formidable');
var fs = require('fs');
var FileManager = require('../modules/filemanager.js');
var Thumbnail=require('../tools/thumbnail.js');
var thumbnail=new Thumbnail({spath:__dirname +'/../uploads/img',dpath:'../uploads/imgThumbnails'});

router.post('/img', stateCheck.checkLogin);
router.post('/img', function (req, res) {
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.uploadDir = __dirname + '/../uploads/img';
    form.parse(req, function (err, fields, files) {
        if (err)
            throw err;
        var image = files.file;
        var path = image.path;
        var type = image.type;
        path = path.replace('/\\/g', '/');
        var storename = path.substr(path.lastIndexOf('\\') + 1, path.length);
        var url = '/img' + path.substr(path.lastIndexOf('\\'), path.length);
        var filemanager = new FileManager(storename, image.name, req.session.user.name, path);
        filemanager.save(function (err) {
        });
        type = type.substr(0, type.indexOf('/'));
        if (type != "image") {
            var info = {
                "error": 1,
                "message": "请上传图片"
            };
            fs.unlink(path);
            FileManager.remove(storename);
            return res.send(info);
        }
       /* thumbnail.thumbnail(storename, function (err,fileurl) {
            var info = {
                "sourceImg": url,
                "thumbnailImg":fileurl.substring(fileurl.indexOf('/',fileurl.indexOf('/')+1),fileurl.length)
            };
            return res.send(info);
        });*/
        info = {
            "sourceImg": url,
            "thumbnailImg":url
        };
        return res.send(info);
    });
});
module.exports = router;