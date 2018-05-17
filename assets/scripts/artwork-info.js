var artworkInfo = {
	showing: false,
	buttons: null,
	init: function () {
		buttons = document.querySelectorAll(".artwork_piece .actions .info");
		buttons.forEach(function (button) {
			var artworkWrap = button.closest(".artwork_piece");

			var infoData = {
				button: button,
				artworkWrap: artworkWrap,
				close: artworkWrap.querySelector(".close")
			};

			// this.buttons.push(infoData);

			infoData.close.addEventListener("click", this.toggleInfo.bind(infoData));
			button.addEventListener("click", this.toggleInfo.bind(infoData));
		}, this);
	},
	// reset: function(){
	// 	this.buttons.forEach(function(button) {
	// 		infoData.close.removeEventListener("click", this.toggleInfo.bind(infoData));
	// 		button.removeEventListener("click", this.toggleInfo.bind(infoData));
	// 	}, this);
	// },
	toggleInfo: function () {
		var infoData = this;
		// setTimeout(function () {
		// 	window.scrollBy({
		// 		top: -30,
		// 		left: 0,
		// 		behavior: 'auto'
		// 	});
		// }, 0);
		// disable or enbale scrolling
		console.log(window.innerHeight);
		if (artworkInfo.showing) {
			scrollJack.clearAllBodyScrollLocks();
		} else {
			scrollJack.disableBodyScroll();
		}
		infoData.artworkWrap.classList.toggle("show-info");



		//toggle artwork info showing variable
		artworkInfo.showing = !artworkInfo.showing;
	}
};
