zoomy = {
	pictures: Array(),
	isTouchDevice: utilities.isTouchDevice(),
	mouseMapEventsAdded: false,
	init: function () {
		this.reset();
		document.querySelectorAll(".artwork_piece .actions .zoom").forEach(function (value, index) {
			var artworkPieceWrap = value.parentNode.parentNode.parentNode.parentNode;
			var zoomyWrap = artworkPieceWrap.querySelector(".zoomy-wrap");
			var mouseMapImage = artworkPieceWrap.querySelector(".mouse-map");
			var img = artworkPieceWrap.firstElementChild;
			this.pictures.push({
				button: value,
				index: index,
				artworksIndex: artworkPieceWrap.getAttribute('artworks-index'),
				zoomyWrap: zoomyWrap,
				artworkPieceWrap: artworkPieceWrap,
				image: img,
				imageRotation: artworkPieceWrap.classList.contains('width')
				               ? 'width'
				               : 'height',
				mouseMapImage: mouseMapImage,
				mouseMapImageHeight: mouseMapImage.clientHeight,
				mouseMapImageWidth: mouseMapImage.clientWidth,
				mouseMoveHandler: null,
				touchMoveHandler: null,
				isZoomed: false,
				scaleWidth: mouseMapImage.getAttribute('scaleWidth'),
				scaleHeight: mouseMapImage.getAttribute('scaleHeight')
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

	reset: function () {
		this.pictures = Array();
	},

	toggleZoom: function (e) {
		if (e.currentTarget.classList.contains('mouse-map')) {
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
	mapMouseToImage: function (e) {
		var mouseMap = this.mouseMapImage;
		var position = mousePosition.mousePositionElement(e);
		console.log('position.x, position.y: ' + position.x, position.y);
		if (position.x > 0) {
			var leftPercentage = 0;
			var topPercentage = 0;

			if(nakasentro.artworks[this.artworksIndex].imageCentered === true) {
				// image centered
				console.log('image centered');
				// adjust the percentage based on the scale amount (the transfoorm: scale() messes with the sizes somehow
				if (this.imageRotation === 'width') {
					console.log('width');
					leftPercentage = (position.x / (mouseMap.clientWidth * this.scaleWidth)) * 100;
					topPercentage = (position.y / ((mouseMap.clientWidth * this.scaleWidth) * nakasentro.artworks[this.artworksIndex].originalDimensions.imageRatioHeight)) * 100;
				} else {
					console.log('height');
					topPercentage = (position.y / (mouseMap.clientHeight * this.scaleHeight)) * 100;
					leftPercentage = (position.x / (((mouseMap.clientHeight * this.scaleHeight) * nakasentro.artworks[this.artworksIndex].originalDimensions.imageRatioWidth) * this.scaleWidth)) * 100;
				}
			}else{
				console.log('image not centered');
				// image not centered
				var leftPercentage = position.x / mouseMap.clientWidth * 101;
				var topPercentage = position.y / mouseMap.clientHeight * 101;
			}

			// console.log('leftPercentage, topPercentage: ' + leftPercentage, topPercentage);
			// set max and min values
			topPercentage = topPercentage < 0
			                ? 0
			                : topPercentage;
			topPercentage = topPercentage > 100
			                ? 100
			                : topPercentage;
			leftPercentage = leftPercentage < 0
			                 ? 0
			                 : leftPercentage;
			leftPercentage = leftPercentage > 100
			                 ? 100
			                 : leftPercentage;

			this.mouseMapImage.style.backgroundPosition = leftPercentage + "% " + topPercentage + "%";
		}
	}
};
