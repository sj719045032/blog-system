/**
 * Created by shijin on 2015/10/26.
 */
var mongoose=require('mongoose');
var db=mongoose.createConnection('mongodb://localhost:27017/stone');
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // yay!
    console.log("mongoose启动了！");
});
exports.db=db;
exports.mongoose=mongoose;
