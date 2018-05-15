var moreInfo = {
  init: function(){
    var infoButtons = document.querySelectorAll('.actions .info');
    infoButtons.forEach(function(button){
      var compareHeight = button.getAttribute('data-compare-height-in-inches')
      var width = button.getAttribute('data-width');
      var height = button.getAttribute('data-height');
      var image_ratio = width/height;
      var compareImage = button.closest('.image-wrap').querySelector('.main-img');

      if(nakasentro.getBrowserOrientation)
      var comapreImageRelativeRatio =
      console.log(compareImage);
      compareImage

      // We need to figure out who is the largest image, the painting or the relative image.

    }, this);
  }
}

