/**
 * Created by shijin on 2015/11/26.
 */
adminApp
    .constant("contentsUrl", "http://localhost:3000/admin/content/")
    .factory("contentService", function ($http,$q, contentsUrl) {
        return {
            getContents: function (page) {
                var deferred=$q.defer();
                 $http.get(contentsUrl+"?p="+page).success(function (data) {
                      deferred.resolve(data);
                 }).error(function (reason) {
                     deferred.reject(reason);
                 });
                return deferred.promise;
            }
        }
    });