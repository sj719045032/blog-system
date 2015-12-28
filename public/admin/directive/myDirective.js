/**
 * Created by shijin on 2015/11/30.
 */
adminApp.directive("checkBox", function () {
    return {
        restrict:"A",
        scope:{
          ngModel:'='
        },
        controller: function ($scope, $attrs) {
            console.log($scope.ngModel);
        }
        
    }
});