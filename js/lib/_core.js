// ===================================================================================
//                CONTROL THE WHOLE SITE USING THIS OBJECT
// ===================================================================================

var _core = angular.module('_core', []);


_core.controller('mainController', ['$rootScope', '$scope', '$log', 'menu', 'lightbox', 'backstretch', 'utils', function($rootScope, $scope, $log, menu, lightbox, backstretch, utils) {
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

// Here's a few simple helpers to allow us to update, set,get & run functions within our app.
var _core_extension = {
    /**
        * Function: Run - simple way to invoke functions within the scope of the app controller, simply pass it's object location within the scope dot noted for depth, and an array of parameters to pass to that function.
        * Usage: Angular: _core.run('module.backstretch.generateBanner', [arg1,arg2]); Where Module is the root level, Back stretch is a sub object of Module, and generateBanner is the function.
        * @param String - location - dot notated param, should be the location of your function. Can also be root level. 
        * @param Array - params - Pass paramaters as you would like a normal function, but inside an array. These will then be parsed to the function you're running.
    */
    run : function(location, params) {
        console.log('parms', params);
        var result = _core_extension.finder('run', location, params);
        _core_extension.refresh();
        return result;
    },
    /**
        * Function: Get - Returns values from the app
        * Usage: Angular: _core.get('module.backstretch.isAllowed'); Where Module is the root level, Back stretch is a sub object of Module, and isAllowed is a bool value you're trying to return.
        * @param String - location - dot notated param, should be the location of your key. Can also be root level. 
    */
    get : function(location) {
        return _core_extension.finder('get', location);
    },
    /**
        * Function: Set - Will update values within an app, or set new ones, or set functions. It will also apply these changes live to update functions/variables/controllers automatically.
        * Usage: Angular: _core.set('module.backstretch.isAllowed', value); Where Module is the root level, Back stretch is a sub object of Module, and isAllowed is a bool value you're trying to return.
        * @param String - location - dot notated param, should be the location of desired new value or updated value. Can also be root level. 
    */
    set : function(location, value) {
        var result = _core_extension.finder('set', location, value);
        _core_extension.refresh();
        return result;
    },
    /**
        * Function: getScope - Returns the scope of the main app.
        * Usage: Angular: _core.getScope();
    */
    getScope : function() {
        return angular.element(document).scope();
    },
    /**
        * Function: refresh - Will redraw the controller/app with current/updated values from the app.
        * Usage: Angular: _core.refresh();
    */
    refresh: function() {
        _core_extension.getScope().$apply();
    },
    /**
        * Function: Finder - Internal use only, it will search the apps root and child locations for the values/functions you're searching for, this will apply, get set or run depending on the type you pass it.
        * Usage: Angular: _core.finder('get', 'module.isAllowed'); Where Module is the root level and isAllowed is a bool value you're trying to return.
        * @param String - type - get, set or run. - Description as above.
        * @param String - location - dot notated param, should be the location of desired new value or updated value. Can also be root level. 
        * @param paramsOrValues - Pass paramaters as you would like a normal function, but inside an array. These will then be parsed to the function you're running.
    */
    finder : function(type, location, paramsOrValues) {
        var module = angular.element(document).scope();
        var base = module;
        var child = module.$$childTail;
        var depth = location.split('.');
        var last = depth.pop();
        for(var loc in depth) if (!angular.isUndefined(base[depth[loc]])) base = base[depth[loc]];
        for(var loc in depth) if (!angular.isUndefined(child[depth[loc]])) child = child[depth[loc]];
        switch(type) {
            case 'run':
                var params = (angular.isUndefined(paramsOrValues) ? [] : paramsOrValues);
                if (angular.isFunction(base[last])) return base[last].apply(module, params);
                if (angular.isFunction(child[last])) return child[last].apply(module, params);
            break;
            case 'get':
                if (!angular.isUndefined(base[last])) return base[last];
                if (!angular.isUndefined(child[last])) return child[last];
            break;
            case 'set':
                if (!angular.isUndefined(last) && !angular.isUndefined(paramsOrValues)) base[last] = paramsOrValues;
                if (!angular.isUndefined(last) && !angular.isUndefined(paramsOrValues)) child[last] = paramsOrValues;
                return true;
            break;
        }    
        return _core_extension.run('methods.oops', [type, location, paramsOrValues]);
    }
}
// Now that we've created our addons, extend the gloval object.
_core = angular.extend({}, _core, _core_extension);
// Setup some auto-fire events for the controllers.
angular.element(document,window).bind('touchmove', function(e){
    var d = angular.element('.disableScroll').length; if(d) {e.preventDefault();}
});
angular.element(document).ready(function(e) {
    angular.element(this).scope().onReady(e);
});
angular.element(window).scroll(function(e){
    angular.element(document).scope().onScroll(e);
})
angular.element(window).on('resize', function(e) {
    angular.element(document).scope().onResize(e);
});
    

