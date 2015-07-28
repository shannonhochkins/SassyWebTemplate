'use strict';
var app = angular.module('app', ['ui.bootstrap']).run(['$rootScope', 'menu', 'lightbox', 'backstretch', function($rootScope, menu, lightbox, backstretch) {
     // Setup some initial options.
    $rootScope.options = {
        fluidLayoutSmall: 1008,
        fluidLayoutLarge: 1300,
        smallFluidClass: 'fluid',
        nonFluidClass: 'static',
        largeFluidClass: 'wide',
        isSmaller: null,
        isLarger: null,
    };

    var modules = {
        'menu' : menu,
        'lightbox': lightbox,
        'backstretch': backstretch,
    };
    // Create our default modules object.
    $rootScope.module = {};
    // If we're created, injected any factories/serivces/providers. Here we can parse them and inject them into the root level for access globally.
    for (var module in modules) {
        var name = module;
        var injection = {};
        injection[name] = modules[module];
        $rootScope.module = angular.merge({}, $rootScope.module, injection);
    }

    $rootScope.methods = {
        bindFluidClass :  function() {
            // Width is 30 margin from left, plus the gridContainer automated width. If sassy grids is updated, this will change the below value.
            $rootScope.options.isSmaller = (Modernizr.mq('(max-width: '+$rootScope.options.fluidLayoutSmall+'px)') ? true : false);
            $rootScope.options.isLarger = (Modernizr.mq('(max-width: '+$rootScope.options.fluidLayoutLarge+'px)') ? true : false);
            var fluidContainers = angular.element('.gridContainer, body, html');
            fluidContainers.toggleClass($rootScope.options.smallFluidClass, $rootScope.options.isSmaller);
            fluidContainers.toggleClass($rootScope.options.nonFluidClass, !$rootScope.options.isSmaller);
            angular.element('body').toggleClass($rootScope.options.largeFluidClass, !$rootScope.options.isLarger);
        }
    }
    // We define these three functions outside the general rootScope, because they're accessed once, and should only be accessed once.
    $rootScope.onReady = function(e) {
        $rootScope.methods.bindFluidClass();
        for(var module in $rootScope['module']) {
            if (angular.isFunction($rootScope['module'][module].onReady)) {
                $rootScope['module'][module].onReady.apply(this,[e]);
            }
        }
    };
    $rootScope.onResize = function(e) {
        $rootScope.methods.bindFluidClass();
        for(var module in $rootScope['module']) {
            if (angular.isFunction($rootScope['module'][module].onResize)) {
                $rootScope['module'][module].onResize.apply(this,[e]);
            }
        }
    };
    $rootScope.onScroll = function(e) {
        for(var module in $rootScope['module']) {
            if (angular.isFunction($rootScope['module'][module].onScroll)) {
                $rootScope['module'][module].onScroll.apply(this, [e]);
            }
        }
    };
}]);


// Here's a few simple helpers to allow us to update, set,get & run functions within our app.
var app_extension = {
    /**
        * Function: Run - simple way to invoke functions within the scope of the app controller, simply pass it's object location within the scope dot noted for depth, and an array of parameters to pass to that function.
        * Usage: Angular: app.run('module.backstretch.generateBanner', [arg1,arg2]); Where Module is the root level, Back stretch is a sub object of Module, and generateBanner is the function.
        * @param String - location - dot notated param, should be the location of your function. Can also be root level. 
        * @param Array - params - Pass paramaters as you would like a normal function, but inside an array. These will then be parsed to the function you're running.
    */
    run : function(location, params) {
        console.log('parms', params);
        var result = app_extension.finder('run', location, params);
        app_extension.refresh();
        return result;
    },
    /**
        * Function: Get - Returns values from the app
        * Usage: Angular: app.get('module.backstretch.isAllowed'); Where Module is the root level, Back stretch is a sub object of Module, and isAllowed is a bool value you're trying to return.
        * @param String - location - dot notated param, should be the location of your key. Can also be root level. 
    */
    get : function(location) {
        return app_extension.finder('get', location);
    },
    /**
        * Function: Set - Will update values within an app, or set new ones, or set functions. It will also apply these changes live to update functions/variables/controllers automatically.
        * Usage: Angular: app.set('module.backstretch.isAllowed', value); Where Module is the root level, Back stretch is a sub object of Module, and isAllowed is a bool value you're trying to return.
        * @param String - location - dot notated param, should be the location of desired new value or updated value. Can also be root level. 
    */
    set : function(location, value) {
        var result = app_extension.finder('set', location, value);
        app_extension.refresh();
        return result;
    },
    /**
        * Function: getScope - Returns the scope of the main app.
        * Usage: Angular: app.getScope();
    */
    getScope : function() {
        return angular.element(document).scope();
    },
    /**
        * Function: refresh - Will redraw the controller/app with current/updated values from the app.
        * Usage: Angular: app.refresh();
    */
    refresh: function() {
        app_extension.getScope().$apply();
    },
    /**
        * Function: Finder - Internal use only, it will search the apps root and child locations for the values/functions you're searching for, this will apply, get set or run depending on the type you pass it.
        * Usage: Angular: app.finder('get', 'module.isAllowed'); Where Module is the root level and isAllowed is a bool value you're trying to return.
        * @param String - type - get, set or run. - Description as above.
        * @param String - location - dot notated param, should be the location of desired new value or updated value. Can also be root level. 
        * @param paramsOrValues - Pass paramaters as you would like a normal function, but inside an array. These will then be parsed to the function you're running.
    */
    finder : function(type, location, paramsOrValues) {
        var module = app_extension.getScope();
        var child = module.$$childTail;
        var look = app_extension.look(location);
        var result = look.result;
       if (result == false) type = 'doNotRun';
        switch(type) {
            case 'run':
                var params = (angular.isUndefined(paramsOrValues) ? [] : paramsOrValues);
                if (angular.isFunction(result)) return result.apply(module, params);
            break;
            case 'get':
                if (!angular.isUndefined(result)) return result;
            break;
            case 'set':
                if (!angular.isUndefined(result) && !angular.isUndefined(paramsOrValues)) eval(look.foundIn + '.' + location + ' = ' + JSON.stringify(paramsOrValues));
                return true;
            break;
        }    
        if (result == false) return app_extension.run('methods.oops', [type, location, paramsOrValues]);
    },
    /**
        * Function: Look - Deep scan for the intended function/value find/set/run command.
        * Usage: Angular: app.look('module.isAllowed'); Will try to find the object module.isAllowed and return the result.
        * @param String - location - dot notated param, should be the location of desired new value or updated value. Can also be root level. 
    */
    look: function(location) {
        var module = app_extension.getScope();
        var child = module.$$childTail;
        var r = false;
        try {
            r = eval('module.' + location);
            found = 'module';
        } catch(e) {}
        try {
            r = eval('child.' + location);
            found = 'child';
        } catch(e) {}

        return {
            'result' : r,
            'foundIn' : found
        };
    }
}
// Now that we've created our addons, extend the gloval object.
app = angular.extend({}, app, app_extension);
// Setup some auto-fire events for the controllers.
angular.element(document,window).bind('touchmove', function(e){
    var d = angular.element('.disableScroll').length; if(d) {e.preventDefault();}
});
angular.element(document).ready(function(e) {
    app.getScope().onReady(e);
});
angular.element(window).scroll(function(e){
    app.getScope().onScroll(e);
})
angular.element(window).on('resize', function(e) {
    app.getScope().onResize(e);
});
    

