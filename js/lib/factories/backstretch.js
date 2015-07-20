// Note: Any factory we register, needs to also be parsed to the controller.
/**
    * Backstrech is a jQuery plugin, which will allow you to chose a source container, which contains images and than automatically fill the destination container with the new image even on resize.
    * Usage: Angular: _core.run('module.backstretch.generateBanner', [source,destination]);, Internal: backstretch.generateBanner(source, destination);
    * @param source - The container which has images as children.
    * @param destination - The location the images will span/fill the container without stretching/breaking proportions.
*/
_core.factory('backstretch', function(){
  var backstretch = {
    options : {
        disableThumbSize: false,
        disableLargeSize: false,
        thumbImgSize: '',
        largeImageSize: '',
        galleryDelay : 500,
        galleryFadeAnimation : 500,
    },
    onReady: function() {
        var $this = backstretch;
        $('.backStretch').each(function() {
            $this.generateBanner($(this), false);
        });
    },
    generateBanner: function(source, destination) {
        backstretch.build(source, destination, {
            onLoadCallback: function() {
                destination = (destination == false ? $(source) : $(destination));
                destination.removeClass('loading');
            }
        });
    },
    build: function(galleryImages, destination, options) {
        // galleryImages - Container full of img's to create the gallery from.
        // destination - selector where the gallery will be created.
        var self = backstretch;
        var galleries = $(galleryImages);
        if (galleries.length == 0) return;
        var options = (typeof(options) == 'object' ? options : {});
        option = $.extend({}, backstretch.options, options);
        var imageLinks = [];
        galleries.find('img').each(function() {
            var largeSrc = $(this).attr('src');
            largeSrc = largeSrc.split(',')[0] + self.options.largeImageSize;
            imageLinks.push(largeSrc);
            $(this).remove();
        });
        if (destination != false) galleries.remove();
        var destination = (destination ==  false ? galleries : destination);
        var banner = $(destination);
        if (imageLinks.length > 0) {
            banner.addClass('hasImages');
            var timout = setTimeout(function() {
                banner.backstretch(imageLinks, {
                    duration: self.options.galleryDelay,
                    fade: self.options.galleryFadeAnimation,
                    onLoadCallback: function() {
                        banner.removeClass('loading').addClass('loaded');
                        if (typeof options.onLoadCallback == 'function') {
                            options.onLoadCallback.apply(this, [imageLinks]);
                        }
                    }
                });

                if (options.start == false) {
                    banner.backstretch("pause");
                }
            }, 500);
        } else {
            banner.hide();
        }
        return imageLinks;
    }
  }
  // Very important to return backstretch.
  return backstretch;
});
