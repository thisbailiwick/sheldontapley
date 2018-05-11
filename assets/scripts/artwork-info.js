var artworkInfo = {
  showing: false,
  init: function() {
    var buttons = document.querySelectorAll(".artwork_piece .actions .info");
    buttons.forEach(function(button) {
      var artworkWrap = button.closest(".artwork_piece");

      var infoData = {
        button: button,
        artworkWrap: artworkWrap,
        close: artworkWrap.querySelector(".close")
      };

      infoData.close.addEventListener("click", this.toggleInfo.bind(infoData));
      button.addEventListener("click", this.toggleInfo.bind(infoData));
    }, this);
  },
  toggleInfo: function() {
    infoData = this;
    infoData.artworkWrap.classList.toggle("show-info");

    // disable or enbale scrolling
    if(artworkInfo.showing){
      scrollJack.clearAllBodyScrollLocks();
    }else{
      scrollJack.disableBodyScroll();
    }

    //toggle artwork info showing variable
    artworkInfo.showing = !artworkInfo.showing;
  }
};

artworkInfo.init();
