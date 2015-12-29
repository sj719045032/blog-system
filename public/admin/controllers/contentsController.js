/**
 * Created by shijin on 2015/11/26.
 */
adminApp.controller("contentController", function ($scope, $location,contentService,tempContentService) {
    $scope.contents = {};
    $scope.page = 1;
    $scope.total = 1;
    $scope.isSetAll = false;
    $scope.deleteArray = [];
    contentService.getContents(1).then(function (data) {
        $scope.contents = $scope.wrapContents(data.posts);
        $scope.total = data.total;
    });
    $scope.wrapContents = function (contents) {
        var length = contents.length;
        for (var i = 0; i < length; i++) {
            contents[i].isChecked = false;
        }
        return contents;
    };
    $scope.getContentsByPage = function (page) {
        $scope.isSetAll=false;
        if (page > $scope.total || page < 1)
            return true;
        contentService.getContents(page).then(function (data) {
            $scope.contents = data.posts;
            $scope.total = data.total;
            $scope.page = page;
        });
    };
    $scope.deleteContentById = function (id) {

        contentService.deleteContent(id).then(function (data) {
            angular.forEach($scope.contents, function (post, index) {
                if (post._id == id)
                    $scope.contents.splice(index, 1);
            });
        }, function (err) {
            console.log(err);
        })
    };
    $scope.setIdToArray = function (post) {
        if (post.isChecked) {
            if ($scope.deleteArray.indexOf(post._id) == -1)
                $scope.deleteArray.push(post._id);
        } else {
            var index = $scope.deleteArray.indexOf(post._id);
            $scope.deleteArray.splice(index, 1);
        }

    };

    $scope.deleteContentArray = function (idArray) {
        for (var i = 0; i < idArray.length; i++) {
            $scope.deleteContentById(idArray[i]);
        }
    };

    $scope.setAllToArray = function (isSetAll) {
        if (isSetAll) {
            var length = $scope.contents.length;
            for (var i = 0; i < length; i++) {
                var content = $scope.contents[i];
                content.isChecked = true;
                $scope.setIdToArray(content);
            }
        }
        else {
            var length = $scope.contents.length;
            for (var i = 0; i < length; i++) {
                var content = $scope.contents[i];
                content.isChecked = false;
            }
            $scope.deleteArray = [];
        }
    };
    $scope.edit= function (post) {
   $location.path('/edit').replace();
        tempContentService.tempContent=post;
    }
}).controller('editController', function ($scope, tempContentService) {
   $scope.post=tempContentService.tempContent;
    console.log($scope.post);
});

