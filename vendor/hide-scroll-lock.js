(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == 'function' && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw ((f.code = 'MODULE_NOT_FOUND'), f);
      }
      var l = (n[o] = { exports: {} });
      t[o][0].call(
        l.exports,
        function(e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        },
        l,
        l.exports,
        e,
        t,
        n,
        r
      );
    }
    return n[o].exports;
  }
  var i = typeof require == 'function' && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})(
  {
    1: [
      function(require, module, exports) {
        const bodyScrollLock = require('../../lib/bodyScrollLock.js');

        const disableBodyScrollButton = document.querySelector('.disableBodyScroll');
        const enableBodyScrollButton = document.querySelector('.enableBodyScroll');
        const statusElement = document.querySelector('.bodyScrollLockStatus');

        disableBodyScrollButton.onclick = function() {
          console.info('disableBodyScrollButton');
          bodyScrollLock.disableBodyScroll(document.querySelector('.scrollTarget'));

          statusElement.innerHTML = ' &mdash; Scroll Locked';
          statusElement.style.color = 'red';
        };

        enableBodyScrollButton.onclick = function() {
          console.info('enableBodyScrollButton');
          bodyScrollLock.enableBodyScroll(document.querySelector('.scrollTarget'));

          statusElement.innerHTML = ' &mdash; Scroll Unlocked';
          statusElement.style.color = '';
        };
      },
      { '../../lib/bodyScrollLock.js': 2 },
    ],
    2: [
      function(require, module, exports) {
        'use strict';

        Object.defineProperty(exports, '__esModule', {
          value: true,
        });

        var _slicedToArray = (function() {
          function sliceIterator(arr, i) {
            var _arr = [];
            var _n = true;
            var _d = false;
            var _e = undefined;
            try {
              for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
              }
            } catch (err) {
              _d = true;
              _e = err;
            } finally {
              try {
                if (!_n && _i['return']) _i['return']();
              } finally {
                if (_d) throw _e;
              }
            }
            return _arr;
          }
          return function(arr, i) {
            if (Array.isArray(arr)) {
              return arr;
            } else if (Symbol.iterator in Object(arr)) {
              return sliceIterator(arr, i);
            } else {
              throw new TypeError('Invalid attempt to destructure non-iterable instance');
            }
          };
        })();

        // Adopted and modified solution from Bohdan Didukh (2017)
        // https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

        var isIosDevice =
          typeof window !== 'undefined' &&
          window.navigator &&
          window.navigator.platform &&
          /iPad|iPhone|iPod|(iPad Simulator)|(iPhone Simulator)|(iPod Simulator)/.test(window.navigator.platform);

        var firstTargetElement = null;
        var allTargetElements = {};
        var initialClientY = -1;
        var previousBodyOverflowSetting = '';
        var previousDocumentElementOverflowSetting = '';

        var preventDefault = function preventDefault(rawEvent) {
          var e = rawEvent || window.event;
          if (e.preventDefault) e.preventDefault();

          return false;
        };

        var setOverflowHidden = function setOverflowHidden() {
          // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
          // the responsiveness for some reason. Setting within a setTimeout fixes this.
          setTimeout(function() {
            previousBodyOverflowSetting = document.body.style.overflow;
            previousDocumentElementOverflowSetting = document.documentElement.style.overflow;
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
          });
        };

        var setOverflowAuto = function setOverflowAuto() {
          // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
          // the responsiveness for some reason. Setting within a setTimeout fixes this.
          setTimeout(function() {
            document.body.style.overflow = previousBodyOverflowSetting;
            document.documentElement.style.overflow = previousDocumentElementOverflowSetting;
          });
        };

        // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
        var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
          return targetElement
            ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight
            : false;
        };

        var handleScroll = function handleScroll(event, targetElement) {
          var clientY = event.targetTouches[0].clientY - initialClientY;

          if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
            // element is at the top of its scroll
            return preventDefault(event);
          }

          if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
            // element is at the top of its scroll
            return preventDefault(event);
          }

          return true;
        };

        var disableBodyScroll = (exports.disableBodyScroll = function disableBodyScroll(targetElement) {
          if (isIosDevice) {
            if (targetElement) {
              allTargetElements[targetElement] = targetElement;

              targetElement.ontouchstart = function(event) {
                if (event.targetTouches.length === 1) {
                  // detect single touch
                  initialClientY = event.targetTouches[0].clientY;
                }
              };
              targetElement.ontouchmove = function(event) {
                if (event.targetTouches.length === 1) {
                  // detect single touch
                  handleScroll(event, targetElement);
                }
              };
            }
          } else {
            setOverflowHidden();
          }

          if (!firstTargetElement) firstTargetElement = targetElement;
        });

        var clearAllBodyScrollLocks = (exports.clearAllBodyScrollLocks = function clearAllBodyScrollLocks() {
          if (isIosDevice) {
            // Clear all allTargetElements ontouchstart/ontouchmove handlers, and the references
            Object.entries(allTargetElements).forEach(function(_ref) {
              var _ref2 = _slicedToArray(_ref, 2),
                key = _ref2[0],
                targetElement = _ref2[1];

              targetElement.ontouchstart = null;
              targetElement.ontouchmove = null;

              delete allTargetElements[key];
            });

            // Reset initial clientY
            initialClientY = -1;
          } else {
            setOverflowAuto();

            firstTargetElement = null;
          }
        });

        var enableBodyScroll = (exports.enableBodyScroll = function enableBodyScroll(targetElement) {
          if (isIosDevice) {
            targetElement.ontouchstart = null;
            targetElement.ontouchmove = null;
          } else if (firstTargetElement === targetElement) {
            setOverflowAuto();

            firstTargetElement = null;
          }
        });
      },
      {},
    ],
  },
  {},
  [1]
);
