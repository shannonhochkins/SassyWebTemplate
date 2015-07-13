// Note: Any factory we register, needs to also be parsed to the controller.
_core.factory('menu', function(){
  var menu = {
    onReady: function() {
      // Do something here.
    },
    onScroll : function(e) {
      var distance = $(window).scrollTop();
    },
    onResize: function() {
    }
  }
  // Very important to return menu.
  return menu;
});