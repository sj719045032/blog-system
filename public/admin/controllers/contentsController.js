/**
 * Created by shijin on 2015/11/26.
 */
adminApp.controller("contentController", function ($scope, contentService) {
    $scope.contents = {};
    $scope.page = 1;
    $scope.total = 1;
    $scope.checkbox ={};
    contentService.getContents(1).then(function (data) {
        $scope.contents = data.posts;
        $scope.total = data.total;
    });
    $scope.getContentsByPage = function (page) {
        if(page> $scope.total||page<1)
        return true;
        contentService.getContents(page).then(function (data) {
            $scope.contents = data.posts;
            $scope.total = data.total;
            $scope.page = page;
        });
    };
    $scope.deleteContentById= function (id) {

        contentService.deleteContent(id).then(function (data) {
            angular.forEach($scope.contents, function (post, index) {
                if(post._id==id)
                    $scope.contents.splice(index,1);
            });
        }, function (err) {
            console.log(err);
        })
    }

});