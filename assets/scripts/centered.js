var nakasentro = {
  browserOrientation: null,
  fullscreen: document.querySelector(".fullscreen"),
  artworks_elements: document.querySelectorAll(".artwork_piece"),
  artworks: Array(),
  windowHeight: null,
  windowWidth: null,
  windowRatio: null,
  mainContentWidth: null,
  mainContentWrap: document.querySelector(".content>.main"),
  imageCentered: false,
  scrollBeingThrottled: false,
  isTouchDevice: false,

  init: function() {
    //reset values
    this.reset();

    // setup values
    this.setupValues();

    // for when not in fullscreen
    window.addEventListener(
      "scroll",
      function(e) {
        nakasentro.checkArtworks();
      }.bind(this)
    );
    window.addEventListener(
      "scroll",
      this.debounce(function() {
        nakasentro.checkArtworks();
      }, 50)
    );

    // for when in fullscreen
    nakasentro.fullscreen.addEventListener("scroll", function() {
      nakasentro.checkArtworks();
      // console.log('scrolling');=
    });
    window.onload = function() {
      nakasentro.checkArtworks();
    };
    this.isTouchDevice = utilities.isTouchDevice();
    if (this.isTouchDevice === true) {
      this.mobileSettings();
    }
  },
  mobileSettings: function() {
    window.addEventListener(
      "scroll",
      this.debounce(function() {
        nakasentro.checkArtworks();
      }, 50)
    );
  },
  reset: function() {
    // set values back to initial setup
    this.browserOrientation = null;
    this.fullscreen = document.querySelector(".fullscreen");
    this.artworks_elements = document.querySelectorAll(".artwork_piece");
    this.artworks = Array();
    this.windowHeight = null;
    this.windowWidth = null;
    this.windowRatio = null;
    this.mainContentWidth = null;
    this.mainContentWrap = document.querySelector(".content>.main");
    this.imageCentered = false;
    this.scrollBeingThrottled = false;
  },
  setViewportDimensions: function() {
    var viewportDimensions = this.getViewportDimensions();
    this.windowHeight = viewportDimensions.height;
    this.windowWidth = viewportDimensions.width;
    this.windowRatio = this.windowWidth / this.windowHeight;
  },
  resetImageValues: function(artworkImage, artworkImageWrap) {
    artworkImage.style.width = "";
    artworkImage.style.height = "";
    artworkImage.style.minWidth = "";
    artworkImage.style.minHeight = "";
    // artworkImageWrap.style.width = "";
    // artworkImageWrap.style.height = "";
    // artworkImageWrap.style.minWidth = "";
    // artworkImageWrap.style.minHeight = "";
  },
  setupValues: function() {
    this.setViewportDimensions();
    document.body.classList.remove("orientation-portrait", "orientation-landscape", "artworks-processed");

    this.browserOrientation = this.getBrowserOrientation();
    // console.log(this.browserOrientation);

    this.mainContentWidth = this.mainContentWrap.clientWidth;

    this.setBodyClasses("orientation-" + this.browserOrientation);

    nakasentro.artworks_elements.forEach(function(artwork, index) {
      // var zoomWrap = artwork.querySelector('.zoom-wrap');
      var artworkImageWrap = artwork.querySelector(".image-wrap");
      var artworkImage = artworkImageWrap.querySelector(".main-img");
      var zoomyWrap = artworkImageWrap.querySelector(".zoomy-wrap");
      // var mouseMapImage = artworkImageWrap.querySelector(".mouse-map");

      var artworkMetaWrap = artworkImageWrap.querySelector(".artwork-meta");
      this.resetImageValues(artworkImage, artworkImageWrap);
      // document.body.classList.remove('artworks-processed');

      // we need to compare the ratio of the viewport to the ratio of the image.

      artworkImage.style.minHeight = artworkImage.clientHeight + "px";
      artworkImage.style.minWidth = artworkImage.clientWidth + "px";
      var imageVhValue = artworkImage.clientHeight / nakasentro.windowHeight * 100;
      var imageVwValue = artworkImage.clientWidth / nakasentro.windowWidth * 100;
      if (imageVhValue === 0) {
        console.log("———————————image values are zero on init!!!!");
      }
      var imageVhValueToFull = 100 - imageVhValue;

      var imageSizeChangeTechnique = this.getImageSizeChangeTechnique(artworkImage);
      var imageRatio = artworkImage.clientWidth / artworkImage.clientHeight;

      var imageMaxHeight = null;
      // get image max height
      if (imageSizeChangeTechnique === "width") {
        // if imageSizeChangeTechnique is width we want to multiply the viewport width in px by the height/width ratio of the image
        imageMaxHeight = this.windowHeight * (artworkImage.clientHeight / artworkImage.clientWidth);
      } else {
        // if imageSizeChangeTechnique is height we want to just use the viewport height amount.
        imageMaxHeight = this.windowHeight;
      }
      var imageOffsetFromDocTop = utilities.getElementOffsetFromDoc(artworkImage).top;
      var imageMaxHeightCenterPointFromDocTop = imageMaxHeight / 2 + imageOffsetFromDocTop;

      nakasentro.artworks.push({
        artworksIndex: nakasentro.artworks.length,
        visibility: new VisSense(artwork),
        element: artwork,
        artworkImage: artworkImage,
        imageSizeChangeTechnique: imageSizeChangeTechnique,
        imageOffsetFromDocTop: imageOffsetFromDocTop,
        imageMaxHeight: imageMaxHeight,
        imageMaxHeightCenterPointFromDocTop: imageMaxHeightCenterPointFromDocTop,
        // need next two for the zoom
        artworkImageWrap: artworkImageWrap,
        artworkMetaWrap: artworkMetaWrap,
        zoomyWrap: zoomyWrap,
        // mouseMapImage: mouseMapImage,
        originalDimensions: {
          width: artworkImage.clientWidth,
          height: artworkImage.clientHeight,
          imageRatio: imageRatio,
          imageVwValue: imageVwValue,
          imageVhValue: imageVhValue,
          imageVhValueToFull: imageVhValueToFull
        },
        dynamicImageValues: {
          toCenterPercentage: null,
          imageVhValueToFull: imageVhValueToFull,
          imageCurrentHeight: imageVhValue,
          imageCurrentWidth: imageVwValue
        }
      });
    }, this);
    document.body.classList.add("artworks-processed");
    window.addEventListener(
      "resize",
      this.debounce(function() {
        var currentViewportDimenstions = this.getViewportDimensions();
        // console.log(this.windowHeight, currentViewportDimenstions.height, this.windowWidth, currentViewportDimenstions.width);
        if (this.windowHeight !== currentViewportDimenstions.height || this.windowWidth !== currentViewportDimenstions.width) {
          this.artworks = Array();
          this.setupValues();
        }
      }, 250).bind(this)
    );
  },

  getImageSizeChangeTechnique: function(artworkImage) {
    // figure out which way to change image size
    var imageRatio = artworkImage.clientWidth / artworkImage.clientHeight;
    // console.log(this.browserOrientation);
    if (this.browserOrientation === "landscape") {
      if (imageRatio > this.windowRatio) {
        return "width";
      } else {
        return "height";
      }
    }

    // console.log(imageRatio, this.windowRatio);
    if (imageRatio < this.windowRatio) {
      return "height";
    } else {
      return "width";
    }
  },
  // setArtworkWidthHeightSupport: function(artwork) {
  //   var ratioPercentage = 0;
  //   var artworkImage = artwork.querySelector('.zoom-wrap img');
  //   console.log(artworkImage.clientHeight);
  //   if (this.viewportDimensions === "portrait") {
  //     var ratioPercentage = (artworkImage.clientWidth / artworkImage.clientHeight) * 100;
  //   } else {
  //     var ratioPercentage = (artworkImage.clientHeight / artworkImage.clientWidth) * 100;
  //   }
  //   var widthHeightSupportElement = artwork.querySelector(
  //     ".width-height-support"
  //   );
  //   widthHeightSupportElement.style.marginTop = ratioPercentage + "%";
  //   artwork.querySelector('.zoom-wrap').style.position = "absolute";
  // },
  setBodyClasses: function(classes) {
    document.querySelector("body").classList.add(classes);
  },

  getViewportDimensions: function() {
    // TODO: will this work with fullscreen?
    var w = window,
      d = document,
      e = d.documentElement,
      g = d.getElementsByTagName("body")[0],
      x = w.innerWidth || e.clientWidth || g.clientWidth,
      y = w.innerHeight || e.clientHeight || g.clientHeight;

    return { width: x, height: y };
  },

  getBrowserOrientation: function() {
    return this.windowHeight > this.windowWidth ? "portrait" : "landscape";
  },

  getPixelsToCenter: function(distanceFromTopOfViewport) {
    viewport_center = this.windowHeight / 2;
    var center_difference = viewport_center - distanceFromTopOfViewport;

    return center_difference;
  },

  getPercentageToCenter: function(toCenterPixels) {
    return toCenterPixels / nakasentro.windowHeight * 100;
  },

  getVhToCenter: function(toCenterPixels) {
    return toCenterPixels / nakasentro.windowHeight * 100;
  },

  setNewArtworkSize: function(artwork) {
    // var img = artwork.element.querySelector("img");
    var rect = artwork.artworkImage.getBoundingClientRect();
    var distanceFromTopOfViewport = rect.top + rect.height / 2;
    var toCenterPixels = nakasentro.getPixelsToCenter(distanceFromTopOfViewport);
    var toCenterPixelsAbsolute = Math.abs(toCenterPixels);
    // TODO: this is about 51 pixels off, why?!
    toCenterPixelsAbsolute = toCenterPixelsAbsolute;
    var toCenterPercentage = nakasentro.getPercentageToCenter(toCenterPixelsAbsolute);
    // console.log(this.getViewportDimensions());
    // console.log(toCenterPercentage);

    // if we're close to the centerpoint of an image, we trigger a scroll to
    if (toCenterPercentage < 3) {
      document.body.classList.add("centered-image", "centered-image-background-show");
      this.imageCentered = true;

      // window.addEventListener('wheel', function(e){
      //   e.preventDefault();
      // });
      // scrollJack.disableScroll();
      // // scroll to artworkImage center point artworkImage.
      // console.log('artwork.imageMaxHeightCenterPointFromDocTop: ' + artwork.imageMaxHeightCenterPointFromDocTop);
      // console.log('window.scrollY: ' + window.scrollY);

      // window.scrollTo({ top: artwork.imageMaxHeightCenterPointFromDocTop, left: 0, behavior: 'smooth' });
      // window.setTimeout(function(){
      //   scrollJack.enableScroll();
      // }, 1000);

      // document.body.classList.add("no-scroll");
      // this.imageCentered = true;
      // window.setTimeout(function() {
      //   console.log("running timeout");
      //   document.body.classList.remove("no-scroll");
      // }, 0.25);
    } else {
      if (this.imageCentered === true) {
        // timeout matched to .image-centered-background transition-duration
        document.body.classList.remove("centered-image");
        window.setTimeout(function() {
          document.body.classList.remove("centered-image-background-show");
        }, 1000);
        this.imageCentered = false;
      }
    }

    // console.log(artwork.element.width, this.mainContentWidth);
    var currentImageHeight = artwork.artworkImage.clientHeight;
    var currentImageWidth = artwork.artworkImage.clientWidth;
    var newLength = null;

    if (artwork.imageSizeChangeTechnique === "width") {
      // only change the length if it's larger than the original
      if (toCenterPercentage / 100 < artwork.artworkImage.imageVhValue) {
        toCenterPercentage = artwork.artworkImage.imageVhValue * 100;
      }
      newLength = this.getNewLength(artwork, toCenterPercentage);
      this.artworks[artwork.artworksIndex].dynamicImageValues.toCenterPercentage = toCenterPercentage;
      this.artworks[artwork.artworksIndex].dynamicImageValues.imageCurrentWidth = newLength;
      this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull = this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull - newLength;
      this.resizePortrait(artwork, newLength);
    } else {
      if (toCenterPercentage / 100 < artwork.artworkImage.imageVhValue) {
        toCenterPercentage = artwork.artworkImage.imageVhValue * 100;
      }

      newLength = this.getNewLength(artwork, toCenterPercentage);
      this.artworks[artwork.artworksIndex].dynamicImageValues.toCenterPercentage = toCenterPercentage;
      var imageNewHeight = newLength;
      this.artworks[artwork.artworksIndex].dynamicImageValues.imageCurrentHeight = imageNewHeight;
      this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull = this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull - newLength;
      this.resizeLandscape(artwork, imageNewHeight);
    }
  },

  getNewLength: function(artwork, toCenterPercentage) {
    // @t is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time [3].
    // @b is the beginning value of the property.
    // @c is the change between the beginning and destination value of the property.
    // @d is the total time of the tween.
    // TODO: Figure out a better name for lengthValue
    var lengthValue = this.browserOrientation === "portrait" ? artwork.originalDimensions.imageVwValue : artwork.originalDimensions.imageVhValue;
    // lengthValue = lengthValue * .45;

    // var w = window,
    //   doc = document,
    //   e = doc.documentElement,
    //   g = doc.getElementsByTagName("body")[0],
    //   x = w.innerWidth || e.clientWidth || g.clientWidth,
    //   y = w.innerHeight || e.clientHeight || g.clientHeight;

    // var result = x * lengthValue / 100;
    // console.log("result: " + result);

    var toCenterPercentagePassed = 100 - toCenterPercentage;
    var t = toCenterPercentagePassed;
    var b = lengthValue;
    var c = 100 - lengthValue;
    var d = 100;
    // console.log(t, b, c, d);
    var newLength = c * t / d + b;
    // if (newLength > 100) {
    //   newLength = 100;
    // }

    return newLength;
  },

  resizePortrait: function(artwork, imageNewWidth) {
    if (artwork.artworkImage.clientWidth >= artwork.originalDimensions.width) {
      var width = imageNewWidth + "vw";
      var imageWidth = artwork.artworkImage.clientWidth;
      var imageHeight = artwork.artworkImage.clientHeight + "px";
      artwork.artworkImage.style.width = width;
      artwork.zoomyWrap.style.height = imageHeight;
      artwork.zoomyWrap.style.width = width;
      // artwork.zoomyWrap.style.marginLeft = -(imageWidth/2) + 'px';
      artwork.artworkMetaWrap.style.width = imageWidth + "px";
    }
  },

  resizeLandscape: function(artwork, imageNewHeight) {
    if (artwork.artworkImage.clientHeight >= artwork.originalDimensions.height) {
      var height = imageNewHeight + "vh";
      var imageWidth = artwork.artworkImage.clientWidth + "px";
      artwork.artworkImage.style.height = height;
      artwork.zoomyWrap.style.height = height;
      artwork.zoomyWrap.style.width = imageWidth;
      artwork.artworkMetaWrap.style.width = imageWidth;
    }
  },

  checkArtworks: function() {
    nakasentro.artworks.forEach(function(artwork, index) {
      var percent = artwork.visibility.percentage();
      if (percent > 0) {
        nakasentro.setNewArtworkSize(artwork);
      } else {
        // this.resetImageValues(artwork.artworkImage, artwork.artworkImageWrap);
      }
    }, this);
  },

  debounce: function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  }
};
