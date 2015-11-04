/**
 * Created by shijin on 2015/10/26.
 */
var mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/stone');
module.exports=mongoose;
