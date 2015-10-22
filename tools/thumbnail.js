/**
 * Created by shijin on 2015/10/22.
 */
/**
 * 图片缩略图生成器
 */
var Thumbnail = require('thumbnail');
var spath=__dirname+'/../uploads/img';
var dpath=__dirname+'/../uploads/imgThumbnail';
var thumbnail = new Thumbnail(spath, dpath);
thumbnail.ensureThumbnail('395034cf3e50bfc9c526fc4a2dbb855d.jpg', 100, 100, function (err, filename) {
    // "filename" is the name of the thumb in '/path/to/thumbnails'
    console.log(err);
    console.log(filename);
});
/*exports.thumbnail= function (filename ,cb) {
    thumbnail.ensureThumbnail(filename, 100, 100, function (err, filename) {
        // "filename" is the name of the thumb in '/path/to/thumbnails'

        cb(err,dpath+filename);
    });
};*/

