var mousePosition = {
  // Which HTML element is the target of the event
  mouseTarget: function(e) {
    var targ;
    if (!e) {
      var e = window.event;
    }
    if (e.target) {
      targ = e.target;
    } else if (e.srcElement) {
      targ = e.srcElement;
    }
    if (targ.nodeType == 3) {
      // defeat Safari bug
      targ = targ.parentNode;
    }
    return targ;
  },

  // Mouse position relative to the document
  // From http://www.quirksmode.org/js/events_properties.html
  mousePositionDocument: function(e) {
    var posx = 0;
    var posy = 0;
    if (!e) {
      var e = window.event;
    }
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return {
      x: posx,
      y: posy
    };
  },

  // Find out where an element is on the page
  // From http://www.quirksmode.org/js/findpos.html
  findPos: function(obj) {
    var curleft = 0;
    var curtop = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while ((obj = obj.offsetParent));
    }
    return {
      left: curleft,
      top: curtop
    };
  },

  // Mouse position relative to the element
  // not working on IE7 and below
  mousePositionElement: function(e) {
    var mousePosDoc = this.mousePositionDocument(e);
    var target = this.mouseTarget(e);
    var targetPos = this.findPos(target);
    var posx = mousePosDoc.x - targetPos.left;
    var posy = mousePosDoc.y - targetPos.top;
    return {
      x: posx,
      y: posy
    };
  }
};
