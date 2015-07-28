'use strict';

app.controller('mainController', ['$rootScope', '$scope', '$log', '$location', '$window', function($rootScope, $scope, $log, $location, $window) {
    // Define some global methods used across the board.
    $scope.methods = {
        redirect: function(url, refresh) {
            if(refresh || $scope.$$phase) {
                $window.location.href = url;
            } else {
                $scope.$apply(function() {
                    $location.path(url);    
                });
            }
        },
        debug: function() {
            angular.element('body').toggleClass('debug', !angular.element('body').hasClass('debug'));
        },
        oops : function(type, location, paramsOrValues) {
            $log.warn('Couldn\'t find '+ (type == 'run' ? 'funciton' : 'key')+': ' + location);
        },
        scrollTo: function(identifier, offset, callback) {
          if ($(identifier).length > 0) {
            angular.element('html, body').stop(true).animate({
              scrollTop: $(identifier).offset().top - 20 - offset
            }, 400, function() {
              if (angular.isFunction(callback)) {
                callback.apply();
              }
            });
          }
        }
    }
}]);