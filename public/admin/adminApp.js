/**
 * Created by shijin on 2015/11/26.
 */
var adminApp=angular.module('adminApp',['ngRoute']);
adminApp.config(function ($routeProvider) {
    $routeProvider.when('/',{templateUrl:'adminViews/list.html',controller:'contentController'})
        .when('/edit',{templateUrl:'adminViews/edit.html',controller:'editController'});
});