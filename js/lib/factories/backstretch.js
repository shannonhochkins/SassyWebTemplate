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
        thumbImgSize: ',50,50',
        largeImageSize: ',1200,665',
        galleryDelay : 500,
        galleryFadeAnimation : 500,
    },
    onReady: function() {
      
    },
    generateBanner: function(source, destination) {
        backstretch.build(source, destination, {
            onLoadCallback: function() {
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
        var imageLinks = [];
        var imageThumbs = [];
        galleries.find('img').each(function() {
            var thumbSrc = $(this).attr('src');
            thumbSrc = thumbSrc.split(',')[0] + self.vars.thumbImgSize;
            imageThumbs.push(thumbSrc);
            if ($(this).parent().is('a')) {
                var largeSrc = $(this).parent().attr('href');

                largeSrc = largeSrc.split(',')[0] + self.vars.largeImageSize;
                imageLinks.push(largeSrc);
            }
        });
        galleries.remove();
        var images = {
            'mainImages': imageLinks,
            'thumbs': imageThumbs
        };
        var banner = $(destination);
        if (imageLinks.length > 0) {
            banner.addClass('hasImages');
            var timout = setTimeout(function() {
                banner.backstretch(imageLinks, {
                    duration: self.vars.galleryDelay,
                    fade: self.vars.galleryFadeAnimation,
                    onLoadCallback: function() {
                        banner.removeClass('loading').addClass('loaded');
                        if (typeof options.onLoadCallback == 'function') {
                            options.onLoadCallback.apply(this, [images]);
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
        return images;
    }
  }
  // Very important to return backstretch.
  return backstretch;
});
