var utilities = {
  windowHeight: null,
  windowWidth: null,
  windowRatio: null,
  init: function() {
    this.setViewportDimensions();

    // throw in closest polyfill
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;

    if (!Element.prototype.closest)
      Element.prototype.closest = function(s) {
        var el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
          if (el.matches(s)) return el;
          el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
      };
  },
  reset: function() {
    this.windowHeight = null;
    this.windowWidth = null;
    this.windowRatio = null;
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
  setViewportDimensions: function() {
    var viewportDimensions = this.getViewportDimensions();
    this.windowHeight = viewportDimensions.height;
    this.windowWidth = viewportDimensions.width;
    this.windowRatio = this.windowWidth / this.windowHeight;
  },
  isTouchDevice: function() {
    return "ontouchstart" in document.documentElement;
  },
  getElementOffsetFromDoc: function(el) {
    // https://stanko.github.io/javascript-get-element-offset/
    const rect = el.getBoundingClientRect();

    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  },
  getChildren: function(child, skipMe, elementClass) {
    var r = [];
    for (; child; child = child.nextSibling) {
      if (child.nodeType == 1 && child != skipMe && child.classList.contains(elementClass)) {
        r.push(child);
      }
    }
    return r;
  },

  getSiblingByClass: function(element, elementClass) {
    return this.getChildren(element.parentNode.firstChild, element, elementClass);
  }
};

utilities.init();
