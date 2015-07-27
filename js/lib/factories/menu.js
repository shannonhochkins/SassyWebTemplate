// Note: Any factory we register, needs to also be parsed to the controller.
app.factory('menu', function(){
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
  return menu;
});