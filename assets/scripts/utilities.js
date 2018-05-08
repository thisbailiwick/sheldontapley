var utilities = {
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
      if (child.nodeType == 1 && child != skipMe &&  child.classList.contains(elementClass)) {
        r.push(child);
      }
    }
    return r;
  },

  getSiblingByClass: function(element, elementClass) {
    return this.getChildren(element.parentNode.firstChild, element, elementClass);
  }
};
