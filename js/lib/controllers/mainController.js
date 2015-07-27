app.controller('mainController', ['$rootScope', '$scope', '$log', '$location', '$window', 'menu', 'lightbox', 'backstretch', 'utils', function($rootScope, $scope, $log, $location, $window, menu, lightbox, backstretch, utils) {
    
    // Define any injected factories/serivces/providers you wish to be acccesed from this controller.
    // Key : Name of the module to be inserted
    // Val : Function/module/factory/service/provider to link.
    var modules = {
        'utils' : utils,
        'menu' : menu,
        'lightbox': lightbox,
        'backstretch': backstretch,
    };
    // Create our default modules object.
    $scope.module = {};
    // If we're created, injected any factories/serivces/providers. Here we can parse them and inject them into the root level for access globally.
    for (var module in modules) {
        var name = module;
        var injection = {};
        injection[name] = modules[module];
        $scope.module = angular.merge({}, $scope.module, injection);
    }
    // Setup some initial options.
    $scope.options = {
        fluidLayoutSmall: 1008,
        fluidLayoutLarge: 1300,
        smallFluidClass: 'fluid',
        nonFluidClass: 'static',
        largeFluidClass: 'wide',
        isSmaller: null,
        isLarger: null,
    };
    // Define some gloval methods used across the board.
    $scope.methods = {
        uncloak: function() {
            angular.element('body').removeClass('ng-cloak');
        },
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
            console.log('ty',type,location,paramsOrValues)
            $log.warn('Couldn\'t find '+ (type == 'run' ? 'funciton' : 'key')+': ' + location);
        },
        bindFluidClass: function() {
            // Width is 30 margin from left, plus the gridContainer automated width. If sassy grids is updated, this will change the below value.
            $scope.options.isSmaller = (Modernizr.mq('(max-width: '+$scope.options.fluidLayoutSmall+'px)') ? true : false);
            $scope.options.isLarger = (Modernizr.mq('(max-width: '+$scope.options.fluidLayoutLarge+'px)') ? true : false);
            var fluidContainers = angular.element('.gridContainer, body, html');
            fluidContainers.toggleClass($scope.options.smallFluidClass, $scope.options.isSmaller);
            fluidContainers.toggleClass($scope.options.nonFluidClass, !$scope.options.isSmaller);
            angular.element('body').toggleClass($scope.options.largeFluidClass, !$scope.options.isLarger);
        },
    }

    // We define these three functions outside the general scope, because they're accessed once, and should only be accessed once.
    $rootScope.onReady = function(e) {
        $scope.methods.bindFluidClass();
        for(var module in $scope['module']) {
            if (angular.isFunction($scope['module'][module].onReady)) {
                $scope['module'][module].onReady.apply(this,[e]);
            }
        }
    };
    $rootScope.onResize = function(e) {
        $scope.methods.bindFluidClass();
        for(var module in $scope['module']) {
            if (angular.isFunction($scope['module'][module].onResize)) {
                $scope['module'][module].onResize.apply(this,[e]);
            }
        }
    };
    $rootScope.onScroll = function(e) {
        for(var module in $scope['module']) {
            if (angular.isFunction($scope['module'][module].onScroll)) {
                $scope['module'][module].onScroll.apply(this, [e]);
            }
        }
    };
    
}]);