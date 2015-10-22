/**
 * Created by shijin on 2015/10/22.
 */
/**
 * 图片缩略图生成器
 */

var fs = require('fs')
var gm = require('gm');

// resize and remove EXIF profile data

function Thumbnail(info) {
    this.spath = info.spath;
    this.dpath = info.dpath;
    this.width = info.width || 100;
    this.height = info.height || 100;
}
module.exports = Thumbnail;

Thumbnail.prototype.thumbnail = function (sfilename, cb) {
    var dpath=this.dpath;
    gm(this.spath +'/'+ sfilename)
        .resize(this.width, this.height)
        .noProfile()
        .write(__dirname+'/'+dpath + '/t'+sfilename,function (err) {

            cb(err, dpath + '/t'+sfilename);

        });

};