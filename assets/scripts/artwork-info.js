var artworkInfo = {
  artworks: Array(),
  init: function(){
    var buttons = docuement.querySelectorAll('.artwork-piece .actions .info');
    buttons.forEach(function(button){
      var infoData = {
        button: button,
        image: utilities.getSiblingByClass(button.parent, 'image-wrap').querySelector('.main-img')
      }
      button.addEventListener('click', this.showInfo.bind(button))
    }, this);
  },
  showInfo: function(){

  }
}
