/**
 * Created by shijin on 2015/11/26.
 */
adminApp
    .constant("contentsUrl", "http://localhost:3000/admin/content/")
    .factory("contentService", function ($http,$q, contentsUrl) {
        return {
            getContents: function (page) {
                var defered=$q.defer();
                 $http.get(contentsUrl+"?p="+page).success(function (data) {
                     defered.resolve(data);
                 }).error(function (reason) {
                     defered.reject(reason);
                 });
                return defered.promise;
            },
            deleteContent: function (id) {
                var defered=$q.defer();
                $http.delete(contentsUrl+id).success(function (data) {
                    defered.resolve(data);
                }).error(function (reason) {
                    defered.reject(reason);
                });
                return defered.promise;

            },
            updateContent: function (id,content) {
                var defered=$q.defer();
                $http.put(contentsUrl+id,content).success(function (data) {
                    defered.resolve(data);
                }).error(function (reason) {
                    defered.reject(reason);
                });
                return defered.promise;
            },
            postContent: function (content) {
                var defered=$q.defer();
                $http.post(contentsUrl,content).success(function (data) {
                    defered.resolve(data);
                }).error(function (reason) {
                    defered.reject(reason);
                });
                return defered.promise;
            }
        }
    }).factory('tempContentService', function () {
        return {
            tempContent:{}
        }
    });
