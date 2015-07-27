// Note: Any factory we register, needs to also be parsed to the controller.
/**
    * Utils an internal addon, It's use is global and is included for every extension.
    * Usage: Angular: app.run('module.utils.methodName');, Internal: utils.methodName();
*/
app.factory('utils', function(){
  var utils = {
    options : {
    },
    onReady: function() {},
    redirect: function(url) {
      angular.element('body').addClass('sprite loading');
      window.location = url;
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
  // Very important to return utils.
  return utils;
});