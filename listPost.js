(function() {
  angular
    .module('LatestPostWPApp', ['truncate','angularUtils.directives.dirPagination'])
    .filter('htmlToPlaintext', function () {
        return function(text) {
            return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
        };
    })
    .directive('postsElement', function() {
        return {
            restrict : 'EA',
            transclude : false,
            templateUrl: '/ourfirm/offices/SiteAssets/webparts/LatestPost/latestPost.html',
            controller: function ($scope, $log, $q, $http, $attrs) {

                $scope.getEvents = function getEvents() {
                    return $http({
                        method : "GET",
                        url: _spPageContextInfo.webAbsoluteUrl + "/" + $attrs.blogsiteurl + "/_api/web/lists/GetByTitle('" + $attrs.listtitle + "')/items?$orderby=PublishedDate desc",
                        headers: { "Accept": "application/json;odata=verbose" }
                    })
                    .then(function sendResponseData(response) {
                        // Success
                        return {
                            Items: response.data.d
                        }
                        
                    }).catch(function(response) {
                        $log.error('HTTP request error: ' + response.status)
                        return $q.reject('Error: ' + response.status);
                    });
                };

                $scope.getEvents()
                .then(function(data) {
					//Get list items
					$scope.posts = data.Items.results;
					
					if ($scope.posts.length > 0) {
                        $scope.viewItemURL = _spPageContextInfo.webAbsoluteUrl + "/" + $attrs.blogsiteurl + "/Lists/" + $attrs.listtitle + "/Post.aspx?ID=";
                        $scope.listRSSURL = _spPageContextInfo.webAbsoluteUrl + "/" + $attrs.blogsiteurl + "/_layouts/15/listfeed.aspx?List={" + $attrs.listid + "}"; 
                        $scope.postAlertURL = _spPageContextInfo.webAbsoluteUrl + "/" + $attrs.blogsiteurl + "/_layouts/15/SubNew.aspx?List={" + $attrs.listid + "}&Source=" + _spPageContextInfo.serverRequestPath + "";                   
                    }
					else {
					    
					    $scope.noItemsFound = true;
					}
				});

            }
            
        };
    }); // End directive()
}()); // End IFFE