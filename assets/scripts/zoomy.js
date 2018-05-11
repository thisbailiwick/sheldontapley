zoomy = {
  pictures: Array(),
  isTouchDevice: utilities.isTouchDevice(),
  mouseMapEventsAdded: false,
  init: function() {
    this.reset();
    var buttons = document.querySelectorAll(".artwork_piece .actions .zoom").forEach(function(value, index) {
      var artworkPieceWrap = value.parentNode.parentNode.parentNode.parentNode;
      var zoomyWrap = artworkPieceWrap.querySelector(".zoomy-wrap");
      var mouseMapImage = artworkPieceWrap.querySelector(".mouse-map");
      var img = artworkPieceWrap.firstElementChild;
      this.pictures.push({
        button: value,
        index: index,
        zoomyWrap: zoomyWrap,
        artworkPieceWrap: artworkPieceWrap,
        image: img,
        mouseMapImage: mouseMapImage,
        mouseMapImageHeight: mouseMapImage.clientHeight,
        mouseMapImageWidth: mouseMapImage.clientWidth,
        mouseMoveHandler: null,
        touchMoveHandler: null,
        isZoomed: false
      });

      // here we bind the picture object to the move event handlers so that we can remove them later: https://kostasbariotis.com/removeeventlistener-and-this/
      this.pictures[index].mouseMoveHandler = this.mapMouseToImage.bind(this.pictures[index]);
      this.pictures[index].touchMoveHandler = this.mapMouseToImage.bind(this.pictures[index]);

      // set up the click event to toggle the magnifier for both button and image itself
      value.addEventListener("click", this.toggleZoom.bind(this.pictures[index]));
      mouseMapImage.addEventListener("click", this.toggleZoom.bind(this.pictures[index]));
      if (this.isTouchDevice) {
        document.body.classList.add("is-touch");
      }
    }, zoomy);
  },

  reset: function() {
    this.pictures = Array();
  },

  toggleZoom: function(e) {
    if(e.currentTarget.classList.contains('mouse-map')){
      zoomy.mapMouseToImage.call(this, e);
    }
    this.artworkPieceWrap.classList.toggle("zoomed");
    document.body.classList.toggle("zoomed");
    this.isZoomed = !this.isZoomed;
    if (zoomy.isTouchDevice) {
      if (this.isZoomed === true) {
        scrollJack.disableBodyScroll(this.mouseMapImage);
      } else {
        scrollJack.clearAllBodyScrollLocks(this.mouseMapImage);
      }
    }

    if (this.isZoomed === true && zoomy.mouseMapEventsAdded === false) {
      zoomy.mouseMapEventsAdded = true;
      this.mouseMapImage.addEventListener("mousemove", this.mouseMoveHandler, false);
      this.mouseMapImage.addEventListener("touchmove", this.touchMoveHandler, false);
    } else if (zoomy.mouseMapEventsAdded) {
      zoomy.mouseMapEventsAdded = false;
      this.mouseMapImage.removeEventListener("mousemove", this.mouseMoveHandler, false);
      this.mouseMapImage.removeEventListener("touchmove", this.touchMoveHandler, false);
    }
  },
  mapMouseToImage: function(e) {
    var zoomyWrap = this.zoomyWrap;
    var position = mousePosition.mousePositionElement(e);
    if (position.x > 0) {
      var leftPercentage = position.x / zoomyWrap.clientWidth * 101;
      var topPercentage = position.y / zoomyWrap.clientHeight * 101;
      topPercentage = topPercentage < 0 ? 0 : topPercentage;
      topPercentage = topPercentage > 100 ? 100 : topPercentage;
      leftPercentage = leftPercentage < 0 ? 0 : leftPercentage;
      leftPercentage = leftPercentage > 100 ? 100 : leftPercentage;
      topValue = -(topPercentage * 0.01 * this.zoomedImageSizeHeight);

      this.mouseMapImage.style.backgroundPosition = leftPercentage + "% " + topPercentage + "%";
    }
  }
};
