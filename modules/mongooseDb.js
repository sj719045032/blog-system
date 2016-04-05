/**
 * Created by shijin on 2015/10/26.
 */
var settings = require('../settings');
var mongoose=require('mongoose');
mongoose.connect(settings.url);
module.exports=mongoose;
