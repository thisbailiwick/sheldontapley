/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */
(function ($) {
  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Sage = {
    // All pages
    common: {
      init: function () {
        // // spin up artwork animation
        // nakasentro.init();
        //
        // //spin up zoomy
        // zoomy.init();
        //
        // // spin up share
        // share.init();
        //
        // //spin up audio
        // stAudio.init();
        //
        // //spin up more info buttons
        // artworkInfo.init();
        // moreInfo.init();

        var playVideo = function () {
          var iframeCode = this.getAttribute("data-embed");
          var parent = this.parentNode.parentNode;
          this.parentNode.outerHTML = iframeCode;
          reframe(parent.querySelector("iframe"));
        };
        var playButtons = document.querySelectorAll(".video .play-button");
        playButtons.forEach(function (value) {
          value.addEventListener("click", playVideo.bind(value), {
            once: true
          }, false);
        });

        // add modal
        var $modal = $("#modal");
        $modal.on("show.bs.modal", function (e) {
          var $video_wrap = $modal.find(".video-embed");
          var embed = decodeURIComponent(
            $(e.relatedTarget)
            .data("embed")
            .replace(/\+/g, " ")
          );
          $video_wrap.append(embed);
          window.setTimeout(function () {
            $video_wrap.fitVids();
          }, 200);
        });

        $modal.on("hide.bs.modal", function (e) {
          $modal.find(".fluid-width-video-wrapper").remove();
        });

        function debounce(func, wait, immediate) {
          var timeout;
          return function () {
            var context = this,
              args = arguments;
            var later = function () {
              timeout = null;
              if (!immediate) {
                func.apply(context, args);
              }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
              func.apply(context, args);
            }
          };
        }

        // setup resize event after user stops resizing
        var resize_event = debounce(function () {
          // things to run after resize
          moreInfo.init();
        }, 500);

        window.addEventListener("resize", resize_event);

        // add scroll to function
        // can be used like $('.banner').goTo();
        $.fn.goTo = function () {
          $("html, body").animate({
              scrollTop: $(this).offset().top + "px"
            },
            "fast"
          );
          return this; // for chaining...
        };

        // init fullscreen
        var CommonView = Barba.BaseView.extend({
          namespace: "common",
          onEnterCompleted: function () {
            // The Transition has just finished.
	          // spin up artwork animation
	          nakasentro.init();

	          //spin up zoomy
	          zoomy.init();

	          // spin up share
	          share.init();

	          //spin up audio
	          stAudio.init();

	          //spin up more info buttons
	          artworkInfo.init();
	          moreInfo.init();
          },
          onLeave: function () {
            stAudio.stopAllPlayers();
          }
        });
        CommonView.init();

        Barba.Pjax.start({
          showFullscreenModal: true
        });
      },
      finalize: function () {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Home page
    home: {
      init: function () {
        // JavaScript to be fired on the home page
      },
      finalize: function () {
        // JavaScript to be fired on the home page, after the init JS
      }
    },
    // About us page, note the change from about-us to about_us.
    about_us: {
      init: function () {
        // JavaScript to be fired on the about us page
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function (func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = funcname === undefined ? "init" : funcname;
      fire = func !== "";
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === "function";

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function () {
      // Fire common init JS
      UTIL.fire("common");

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, "_").split(/\s+/), function (i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, "finalize");
      });

      // Fire common finalize JS
      UTIL.fire("common", "finalize");
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);
})(jQuery); // Fully reference jQuery after this point.
