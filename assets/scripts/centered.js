var nakasentro = {
  fullscreen: document.querySelector(".fullscreen"),
  fullscreenWrapper: document.querySelector('.fullscreen-wrapper'),
  artworks_elements: document.querySelectorAll(".artwork_piece"),
  artworks: Array(),
  mainContentWidth: null,
  mainContentWrap: document.querySelector(".content>.main"),
  imageCentered: false,
  scrollBeingThrottled: false,
  isTouchDevice: false,
  isResizing: false,
  consideredCenteredPercentage: 2,
  recentlyAddedCenteredClasses: false,
  recentlyRemovedCenteredClasses: false,

  init: function () {
    //reset values
    this.reset();

    // setup values
    this.setupValues();

    // for when not in fullscreen
    window.addEventListener(
      "scroll",
      function (e) {
        if (!this.isResizing) {
          nakasentro.checkArtworks();
        }
      }.bind(this)
    );
    window.addEventListener(
      "scroll",
      _.debounce(function () {
        if (!nakasentro.isResizing) {
          nakasentro.checkArtworks();
        }
      }, 50)
    );

    // for when in fullscreen
    nakasentro.fullscreen.addEventListener("scroll", function () {
      if (!this.isResizing) {
        nakasentro.checkArtworks();
      }
      // console.log('scrolling');=
    });

    // add event to handle any code needed when there is a fullscreen change event
    window.addEventListener('fullscreenchange', this.fullScreenOnChangeEvent.bind(this), false);


    window.onload = function () {
      nakasentro.checkArtworks();
    };
    this.isTouchDevice = utilities.isTouchDevice();
    if (this.isTouchDevice === true) {
      this.mobileSettings();
    }
  },
  fullScreenOnChangeEvent: function (e) {
    console.log(e);
    // if in fullscreen we want to add remved events which handle scroll when centered and scroll events is not triggered due to fixed elements
    if (Barba.FullScreen.isFullScreen === false) {
      window.removeEventListener('keydown', this.handlePossibleScrollTrigger, false);
      artwork.zoomyWrap.removeEventListener('mousewheel', this.fullscreenHandleZoomyDivScoll, false);
    }



  },
  mobileSettings: function () {
    // TODO: is this necessary?
    window.addEventListener(
      "scroll",
      _.debounce(function () {
        nakasentro.checkArtworks();
      }, 50)
    );
  },
  reset: function () {
    // set values back to initial setup
    this.fullscreen = document.querySelector(".fullscreen");
    this.artworks_elements = document.querySelectorAll(".artwork_piece");
    this.artworks = Array();
    // this.windowHeight = null;
    // this.windowWidth = null;
    // this.windowRatio = null;
    this.mainContentWidth = null;
    this.mainContentWrap = document.querySelector(".content>.main");
    this.imageCentered = false;
    this.scrollBeingThrottled = false;
    document.body.classList.remove("orientation-portrait", "orientation-landscape", "artworks-processed", "centered-image", "centered-image-background-show");
    document.querySelectorAll('.artwork_piece').forEach(function(artworkPiece){
      this.removeArtworkPieceCentered(artworkPiece);
    }, this);
  },

  removeArtworkPieceCentered: function(artworkPiece){
    artworkPiece.classList.remove('centered', 'centered-image-transition-duration');
  },
  // setViewportDimensions: function() {
  //   var viewportDimensions = this.getViewportDimensions();
  //   this.windowHeight = viewportDimensions.height;
  //   this.windowWidth = viewportDimensions.width;
  //   this.windowRatio = this.windowWidth / this.windowHeight;
  // },
  resetImageValues: function (artworkImage, artworkImageWrap) {
    // artworkImage.style.width = "auto";
    // artworkImage.style.height = "auto";
    // artworkImage.style.minWidth = 0;
    // artworkImage.style.minHeight = 0;

    artworkImage.setAttribute("style", "");
    // artworkImageWrap.style.width = "";
    // artworkImageWrap.style.height = "";
    // artworkImageWrap.style.minWidth = "";
    // artworkImageWrap.style.minHeight = "";
  },
  setupValues: function () {
    this.reset();

    this.mainContentWidth = this.mainContentWrap.clientWidth;

    this.setBodyClasses("orientation-" + utilities.browserOrientation);

    nakasentro.artworks_elements.forEach(function (artwork, index) {
      // var zoomWrap = artwork.querySelector('.zoom-wrap');
      var artworkWrap = artwork;
      var artworkImageWrap = artwork.querySelector(".image-wrap");
      var artworkImage = artworkImageWrap.querySelector(".main-img");
      var zoomyWrap = artworkImageWrap.querySelector(".zoomy-wrap");
      var imageSpacePlaceholder = artworkImageWrap.querySelector('.image-space-placeholder');
      // var mouseMapImage = artworkImageWrap.querySelector(".mouse-map");

      var artworkMetaWrap = artworkImageWrap.querySelector(".artwork-meta");
      this.resetImageValues(artworkImage, artworkImageWrap);
      // document.body.classList.remove('artworks-processed');

      // we need to compare the ratio of the viewport to the ratio of the image.
      // debugger;
      artworkImage.style.minHeight = artworkImage.clientHeight + "px";
      artworkImage.style.minWidth = artworkImage.clientWidth + "px";
      var imageVhValue = artworkImage.clientHeight / utilities.windowHeight * 100;
      var imageVwValue = artworkImage.clientWidth / utilities.windowWidth * 100;
      if (imageVhValue === 0) {
        debugger;
        console.log("———————————image values are zero on init!!!!");
      }
      var imageVhValueToFull = 100 - imageVhValue;

      var imageSizeChangeTechnique = utilities.getImageSizeChangeTechnique(artworkImage);
      var imageRatio = artworkImage.clientWidth / artworkImage.clientHeight;

      var imageMaxHeight = null;
      // get image max height
      if (imageSizeChangeTechnique === "width") {
        // if imageSizeChangeTechnique is width we want to multiply the viewport width in px by the height/width ratio of the image
        imageMaxHeight = utilities.windowHeight * (artworkImage.clientHeight / artworkImage.clientWidth);
      } else {
        // if imageSizeChangeTechnique is height we want to just use the viewport height amount.
        imageMaxHeight = utilities.windowHeight;
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
        artworkWrap: artworkWrap,
        artworkImageWrap: artworkImageWrap,
        artworkMetaWrap: artworkMetaWrap,
        zoomyWrap: zoomyWrap,
        imageSpacePlaceholder: imageSpacePlaceholder,
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
    window.addEventListener("resize", this.debounceWindowResize);
    window.addEventListener("resize", function () {
      if (nakasentro.isResizing === false) {
        document.body.classList.add("viewport-resizing");
        nakasentro.isResizing = true;
      }
    });
  },

  debounceWindowResize: _.debounce(function () {
    var currentViewportDimenstions = utilities.getViewportDimensions();
    // console.log(utilities.windowHeight, currentViewportDimenstions.height, utilities.windowWidth, currentViewportDimenstions.width);
    if (utilities.windowHeight !== currentViewportDimenstions.height || utilities.windowWidth !== currentViewportDimenstions.width) {
      nakasentro.artworks = Array();
      utilities.setViewportDimensions();
      nakasentro.setupValues();
    }
    document.body.classList.remove("viewport-resizing");
    nakasentro.isResizing = false;
  }, 250),

  windowResize: function () {
    var currentViewportDimenstions = utilities.getViewportDimensions();
    if (utilities.windowHeight !== currentViewportDimenstions.height || utilities.windowWidth !== currentViewportDimenstions.width) {
      nakasentro.artworks = Array();
      utilities.setViewportDimensions();
      nakasentro.setupValues();
    }
  },

  setBodyClasses: function (classes) {
    document.querySelector("body").classList.add(classes);
  },

  getPixelsToCenter: function (distanceFromTopOfViewport) {
    viewport_center = utilities.windowHeight / 2;
    var center_difference = viewport_center - distanceFromTopOfViewport;

    return center_difference;
  },

  getPercentageToCenter: function (toCenterPixels) {
    return toCenterPixels / utilities.windowHeight * 100;
  },

  getVhToCenter: function (toCenterPixels) {
    return toCenterPixels / utilities.windowHeight * 100;
  },

  setNewArtworkSize: function (artwork) {
    var rect = artwork.imageSpacePlaceholder.getBoundingClientRect();
    var distanceFromTopOfViewport = rect.top + rect.height / 2;
    var toCenterPixels = nakasentro.getPixelsToCenter(distanceFromTopOfViewport);

    var toCenterPixelsAbsolute = Math.abs(toCenterPixels);
    // TODO: this is about 51 pixels off, why?!
    toCenterPixelsAbsolute = toCenterPixelsAbsolute;
    var toCenterPercentage = nakasentro.getPercentageToCenter(toCenterPixelsAbsolute);

    // if we're close to the centerpoint of an image, we trigger a scroll to
    // console.log(toCenterPercentage, ">", nakasentro.consideredCenteredPercentage);
    // console.log(toCenterPercentage > nakasentro.consideredCenteredPercentage);
    if (toCenterPercentage > nakasentro.consideredCenteredPercentage) {
      // image is not centered
      if (this.imageCentered === true && this.recentlyRemovedCenteredClasses === false) {

        // if in fullscreen we want to add remved events which handle scroll when centered and scroll events is not triggered due to fixed elements

        // if (Barba.FullScreen.isFullscreen === true) {
        //   window.removeEventListener('keydown', this.handlePossibleScrollTrigger, false);
        //   artwork.zoomyWrap.removeEventListener('mousewheel', this.fullscreenHandleZoomyDivScoll, false);
        // }
        this.recentlyRemovedCenteredClasses = true;

        window.setTimeout(function () {
          nakasentro.recentlyRemovedCenteredClasses = false;
        }, 500);

        // timeout matched to .image-centered-background transition-duration
        this.imageCentered = false;
        document.body.classList.remove("centered-image");
        artwork.artworkWrap.classList.remove("centered");

        window.setTimeout(function () {
          // here we delay removing a class to allow some css transitions to happen
          document.body.classList.remove("centered-image-background-show");
          artwork.artworkWrap.classList.remove("centered-image-transition-duration");
        }, 250);
      }

      var currentImageHeight = artwork.artworkImage.clientHeight;
      var currentImageWidth = artwork.artworkImage.clientWidth;
      var newLength = null;

      if (toCenterPercentage / 100 < artwork.artworkImage.imageVhValue) {
        toCenterPercentage = artwork.artworkImage.imageVhValue * 100;
      }

      if (artwork.imageSizeChangeTechnique === "width") {
        // this is portrait or an image which is so short height wise it would still hit the left/right portions of the viewport before the top/bottom
        this.setNewWidthValues.call(this, toCenterPercentage, artwork);
      } else {
        // this is landscape or an image which is so short width wise it would still hit the top/bottom portions of the viewport before the left/right
        this.setNewHeightValues.call(this, toCenterPercentage, artwork);
      }
    } else {
      // image is centered

      if (this.imageCentered === false && this.recentlyAddedCenteredClasses === false) {
        // if in fullscreen we want to add these events to handle scroll when centered and scroll events is not triggered due to fixed elements

        // if (Barba.FullScreen.isFullscreen === true) {
        //   window.addEventListener('keydown', this.handlePossibleScrollTrigger, false);
        //   artwork.zoomyWrap.addEventListener('mousewheel', this.fullscreenHandleZoomyDivScoll, false);
        // }
        this.recentlyAddedCenteredClasses = true;
        window.setTimeout(function () {
          nakasentro.recentlyAddedCenteredClasses = false;
        }, 250);
        document.body.classList.add("centered-image", "centered-image-background-show");
        console.log('setting centered classes');
        this.imageCentered = true;
        artwork.artworkWrap.style.top = artwork.artworkWrap.getBoundingClientRect().top;
        // TODO: as of now, the centered-image-transition-duration doesn't do anything. We're going from a static to a fixed positioning, which doesn't allow for transition
        artwork.artworkWrap.classList.add("centered", "centered-image-transition-duration");
      }

      if (artwork.imageSizeChangeTechnique === "width") {
        // only change the length if it's larger than the original
        this.resizePortrait(artwork, 100);
      } else {
        this.resizeLandscape(artwork, 100);
      }
    }
  },

  handlePossibleScrollTrigger: function (event) {
    console.log(event);

  },

  fullscreenHandleZoomyDivScoll: function (event) {
    // console.log('event.deltaY: ' + event.deltaY);
    // var newScrollBy = event.deltaY * 4;
    // console.log(newScrollBy);
    // // nakasentro.fullscreenWrapper.scrollTop = newScrollTop;
    // nakasentro.fullscreen.scrollBy({
    //   top: newScrollBy,
    //   left: 0,
    //   behavior: 'smooth'
    // });
  },

  setNewWidthValues: function (toCenterPercentage, artwork) {
    var newWidthLength = this.getNewLength(toCenterPercentage, artwork.originalDimensions.imageVwValue);
    this.artworks[artwork.artworksIndex].dynamicImageValues.toCenterPercentage = toCenterPercentage;
    this.artworks[artwork.artworksIndex].dynamicImageValues.imageCurrentWidth = newWidthLength;
    this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull = this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull - newWidthLength;
    this.resizePortrait(artwork, newWidthLength);
  },
  setNewHeightValues: function (toCenterPercentage, artwork) {
    newLength = this.getNewLength(toCenterPercentage, artwork.originalDimensions.imageVhValue);
    this.artworks[artwork.artworksIndex].dynamicImageValues.toCenterPercentage = toCenterPercentage;
    var imageNewHeight = newLength;

    this.artworks[artwork.artworksIndex].dynamicImageValues.imageCurrentHeight = imageNewHeight;
    this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull = this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull - newLength;
    this.resizeLandscape(artwork, imageNewHeight);
  },

  getNewLength: function (toCenterPercentage, originalDimensionValue) {
    // @t is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time [3].
    // @b is the beginning value of the property.
    // @c is the change between the beginning and destination value of the property.
    // @d is the total time of the tween.
    // TODO: Figure out a better name for lengthValue
    // var lengthValue = this.browserOrientation === "portrait" ? artwork.originalDimensions.imageVwValue : artwork.originalDimensions.imageVhValue;
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
    var b = originalDimensionValue;
    var c = 100 - originalDimensionValue;
    var d = 100;
    // console.log(t, b, c, d);
    var newLength = c * t / d + b;
    // if (newLength > 100) {
    //   newLength = 100;
    // }

    return newLength;
  },

  resizePortrait: function (artwork, imageNewWidth) {
    if (artwork.artworkImage.clientWidth >= artwork.originalDimensions.width) {
      var width = imageNewWidth + "vw";
      var imageWidth = artwork.artworkImage.clientWidth;
      var imageHeight = artwork.artworkImage.clientHeight + "px";
      artwork.artworkImage.style.width = width;
      artwork.zoomyWrap.style.height = imageHeight;
      artwork.zoomyWrap.style.width = width;
      artwork.artworkMetaWrap.style.width = imageWidth + "px";

      //this helper div keeps the vertical space when the image is centered and the image itself is positioned 'fixed'
      artwork.imageSpacePlaceholder.style.height = imageNewWidth / artwork.originalDimensions.imageRatio + 'vh';
    }
  },

  resizeLandscape: function (artwork, imageNewHeight) {
    if (artwork.artworkImage.clientHeight >= artwork.originalDimensions.height) {
      var height = imageNewHeight + "vh";
      var imageWidth = artwork.artworkImage.clientWidth + "px";
      artwork.artworkImage.style.height = height;
      artwork.zoomyWrap.style.height = height;
      artwork.zoomyWrap.style.width = imageWidth;
      artwork.artworkMetaWrap.style.width = imageWidth;

      //this helper div keeps the vertical space when the image is centered and the image itself is positioned 'fixed'
      artwork.imageSpacePlaceholder.style.height = height;
    }
  },

  checkArtworks: function () {
    nakasentro.artworks.forEach(function (artwork, index) {
      var percent = artwork.visibility.percentage();
      if (percent > 0) {
        nakasentro.setNewArtworkSize(artwork);
      } else {
        // this.resetImageValues(artwork.artworkImage, artwork.artworkImageWrap);
      }
    }, this);
  }
};
