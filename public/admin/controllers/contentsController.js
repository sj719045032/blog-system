/**
 * Created by shijin on 2015/11/26.
 */
adminApp.controller("contentController", function ($scope,contentService) {
    $scope.contents={};
    $scope.page = 1;
    $scope.ishide=false;
        contentService.getContents(1).then(function (data) {
            console.log(data);
            $scope.contents=data;
        });
    $scope.getContentsByPage= function (page) {
      contentService.getContents(page).then(function (data) {
            $scope.contents=data;
          $scope.page=page;
        });
    };
    
});