// Note: Any factory we register, needs to also be parsed to the controller.
/**
    * lightbox is a jQuery plugin, It allows us to expand the image with a simple click event, by adding a class to the element.
    * Usage: Angular: app.run('module.lightbox.init');, Internal: lightbox.init();
*/

app.factory('lightbox', function(){
  var lightbox = {
    options : {
      selector: '.lightbox'
    },
    onReady: function() {
      lightbox.init();
    },
    init: function() {
      var lbo = $(lightbox.options.selector);
      if (lbo.length == 0) return;
      lbo.magnificPopup({ 
        type: 'image',
        removalDelay: 300,
        mainClass: 'mfp-fade', 
      });
    }
  }
  // Very important to return lightbox.
  return lightbox;
});