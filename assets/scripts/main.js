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
		'common': {
			init: function () {
				// JavaScript to be fired on all pages
				function init_slider() {
					var viewport_width  = document.documentElement.clientWidth;
					var viewport_height = document.documentElement.clientHeight;

					var auto_play = 10000;

					// see if we need to initialize sliders
					if (viewport_width >= 768) {
						// Initialize sliders
						var $carousel = $('.carousel').flickity({
							// options
							cellAlign:      'left',
							contain:        true,
							pageDots:       true,
							arrowShape:     {
								x0: 10,
								x1: 55, y1: 45,
								x2: 65, y2: 40,
								x3: 25
							},
							resize:         true,
							adaptiveHeight: true,
							wrapAround:     true,
							autoPlay:       auto_play
						});

					} else {
						$carousels = $('.carousel');
						// this is for mobile small width only
						$carousels.each(function () {
							var $carousel    = $(this);
							var slide_count  = $carousel.children('.carousel-cell').length;
							var random_index = Math.floor(Math.random() * (slide_count - 0 + 1));
							// Initialize sliders
							$carousel.flickity({
								// options
								cellAlign:      'left',
								contain:        true,
								initialIndex:   random_index,
								arrowShape:     {
									x0: 10,
									x1: 55, y1: 45,
									x2: 65, y2: 40,
									x3: 25
								},
								resize:         true,
								adaptiveHeight: true,
								wrapAround:     true,
								autoPlay:       auto_play
							});

							// $(window).on('resize', function () {
							// 	$carousel.flickity('destroy');
							// 	init_slider();
							// });
						});
					}
				}

				// Setup jplayer
				$.each($('.audio .jp-jplayer'), function () {
					var $player      = $(this);
					var file_path    = $player.data('file-url');
					var file_title   = $player.data('title');
					var container_id = $player.next().attr('id');
					$player.jPlayer({
						ready:               function () {
							var $ready_player = $(this).jPlayer("setMedia", {
								mp3: file_path // Defines the m4v url
							}); // Attempts to Auto-Play the media
						},
						swfPath:             '../../jquery.jplayer.swf',
						solution:            'html, flash',
						supplied:            'mp3',
						preload:             'metadata',
						volume:              0.8,
						muted:               false,
						backgroundColor:     '#000000',
						cssSelectorAncestor: '#' + container_id,
						cssSelector:         {
							videoPlay:            '.jp-video-play',
							play:                 '.jp-play',
							pause:                '.jp-pause',
							stop:                 '.jp-stop',
							seekBar:              '.jp-seek-bar',
							playBar:              '.jp-play-bar',
							mute:                 '.jp-mute',
							unmute:               '.jp-unmute',
							volumeBar:            '.jp-volume-bar',
							volumeBarValue:       '.jp-volume-bar-value',
							volumeMax:            '.jp-volume-max',
							playbackRateBar:      '.jp-playback-rate-bar',
							playbackRateBarValue: '.jp-playback-rate-bar-value',
							currentTime:          '.jp-current-time',
							duration:             '.jp-duration',
							title:                '.jp-title',
							fullScreen:           '.jp-full-screen',
							restoreScreen:        '.jp-restore-screen',
							repeat:               '.jp-repeat',
							repeatOff:            '.jp-repeat-off',
							gui:                  '.jp-gui',
							noSolution:           '.jp-no-solution'
						},
						timeFormat:          {
							padMin: false
						},
						errorAlerts:         false,
						warningAlerts:       false
					});
				});

				// add modal
				var $modal = $('#modal');
				$modal.on('show.bs.modal', function (e) {
					var $video_wrap = $modal.find('.video-embed');
					var embed = decodeURIComponent($(e.relatedTarget).data('embed').replace(/\+/g, ' '));
					$video_wrap.append(embed);
					window.setTimeout(function () {
						$video_wrap.fitVids();
					}, 200);
				});

				$modal.on('hide.bs.modal', function (e) {
					$modal.find('.fluid-width-video-wrapper').remove();
				});

				function debounce(func, wait, immediate) {
					var timeout;
					return function () {
						var context = this, args = arguments;
						var later   = function () {
							timeout = null;
							if (!immediate) func.apply(context, args);
						};
						var callNow = immediate && !timeout;
						clearTimeout(timeout);
						timeout = setTimeout(later, wait);
						if (callNow) func.apply(context, args);
					};
				}

				// setup resize event after user stops resizing
				var resize_event = debounce(function () {
					// things to run after resize

					// possibly
					// 	$carousel.flickity('destroy');
					// 	init_slider();
				}, 500);

				window.addEventListener('resize', resize_event);

				// add scroll to function
				// can be used like $('.banner').goTo();
				$.fn.goTo = function () {
					$('html, body').animate({
						scrollTop: ($(this).offset().top) + 'px'
					}, 'fast');
					return this; // for chaining...
				};
			},
			finalize: function () {
				// JavaScript to be fired on all pages, after page specific JS is fired
			}
		},
		// Home page
		'home': {
			init: function () {
				// JavaScript to be fired on the home page
			},
			finalize: function () {
				// JavaScript to be fired on the home page, after the init JS
			}
		},
		// About us page, note the change from about-us to about_us.
		'about_us': {
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
			funcname = (funcname === undefined)
			           ? 'init'
			           : funcname;
			fire = func !== '';
			fire = fire && namespace[func];
			fire = fire && typeof namespace[func][funcname] === 'function';

			if (fire) {
				namespace[func][funcname](args);
			}
		},
		loadEvents: function () {
			// Fire common init JS
			UTIL.fire('common');

			// Fire page-specific init JS, and then finalize JS
			$.each(document.body.className.replace(/-/g, '_').split(/\s+/), function (i, classnm) {
				UTIL.fire(classnm);
				UTIL.fire(classnm, 'finalize');
			});

			// Fire common finalize JS
			UTIL.fire('common', 'finalize');
		}
	};

	// Load Events
	$(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
