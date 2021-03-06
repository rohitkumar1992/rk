$(function () {

  'use strict';

  var console = window.console || { log: function () {} };
  var $images = $('.docs-pictures');
  var $toggles = $('.docs-toggles');
  var $buttons = $('.docs-buttons');
  var options = {
        url: 'data-original',
        build: function (e) {
          console.log(e.type);
        },
        built: function (e) {
          console.log(e.type);
        },
        show: function (e) {
          console.log(e.type);
        },
        shown: function (e) {
          console.log(e.type);
        },
        hide: function (e) {
          console.log(e.type);
        },
        hidden: function (e) {
          console.log(e.type);
        },
        view: function (e) {
          console.log(e.type);
        },
        viewed: function (e) {
          console.log(e.type);
        }
      };

  function toggleButtons(mode) {
    if (/modal|inline|none/.test(mode)) {
      $buttons.
        find('button[data-enable]').
        prop('disabled', true).
          filter('[data-enable*="' + mode + '"]').
          prop('disabled', false);
    }
  }

  $images.on({
    'build.viewer': function (e) {
      console.log(e.type);
    },
    'built.viewer':  function (e) {
      console.log(e.type);
    },
    'show.viewer':  function (e) {
      console.log(e.type);
    },
    'shown.viewer':  function (e) {
      console.log(e.type);
    },
    'hide.viewer':  function (e) {
      console.log(e.type);
    },
    'hidden.viewer': function (e) {
      console.log(e.type);
    },
    'view.viewer':  function (e) {
      console.log(e.type);
    },
    'viewed.viewer': function (e) {
      console.log(e.type);
    }
  }).viewer(options);

  toggleButtons(options.inline ? 'inline' : 'modal');

  $toggles.on('change', 'input', function () {
    var $input = $(this);
    var name = $input.attr('name');

    options[name] = name === 'inline' ? $input.data('value') : $input.prop('checked');
    $images.viewer('destroy').viewer(options);
    toggleButtons(options.inline ? 'inline' : 'modal');
  });

  $buttons.on('click', 'button', function () {
    var data = $(this).data();
    var args = data.arguments || [];

    if (data.method) {
      if (data.target) {
        $images.viewer(data.method, $(data.target).val());
      } else {
        $images.viewer(data.method, args[0], args[1]);
      }

      switch (data.method) {
        case 'scaleX':
        case 'scaleY':
          args[0] = -args[0];
          break;

        case 'destroy':
          toggleButtons('none');
          break;
      }
    }
  });

});

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    define('viewer', ['jquery'], factory);
  } else if (typeof exports === 'object') {
    factory(require('jquery'));
  } else {
    factory(jQuery);
  }
})(function ($) {

  'use strict';

  var $window = $(window);
  var $document = $(document);

  var NAMESPACE = 'viewer';
  var ELEMENT_VIEWER = document.createElement(NAMESPACE);

  var CLASS_FIXED = 'viewer-fixed';
  var CLASS_OPEN = 'viewer-open';
  var CLASS_SHOW = 'viewer-show';
  var CLASS_HIDE = 'viewer-hide';
  var CLASS_HIDE_XS_DOWN = 'viewer-hide-xs-down';
  var CLASS_HIDE_SM_DOWN = 'viewer-hide-sm-down';
  var CLASS_HIDE_MD_DOWN = 'viewer-hide-md-down';
  var CLASS_FADE = 'viewer-fade';
  var CLASS_IN = 'viewer-in';
  var CLASS_MOVE = 'viewer-move';
  var CLASS_ACTIVE = 'viewer-active';
  var CLASS_INVISIBLE = 'viewer-invisible';
  var CLASS_TRANSITION = 'viewer-transition';
  var CLASS_FULLSCREEN = 'viewer-fullscreen';
  var CLASS_FULLSCREEN_EXIT = 'viewer-fullscreen-exit';
  var CLASS_CLOSE = 'viewer-close';

  var SELECTOR_IMG = 'img';

  var EVENT_MOUSEDOWN = 'mousedown touchstart pointerdown MSPointerDown';
  var EVENT_MOUSEMOVE = 'mousemove touchmove pointermove MSPointerMove';
  var EVENT_MOUSEUP = 'mouseup touchend touchcancel pointerup pointercancel MSPointerUp MSPointerCancel';
  var EVENT_WHEEL = 'wheel mousewheel DOMMouseScroll';
  var EVENT_TRANSITIONEND = 'transitionend';
  var EVENT_LOAD = 'load.' + NAMESPACE;
  var EVENT_KEYDOWN = 'keydown.' + NAMESPACE;
  var EVENT_CLICK = 'click.' + NAMESPACE;
  var EVENT_RESIZE = 'resize.' + NAMESPACE;
  var EVENT_BUILD = 'build.' + NAMESPACE;
  var EVENT_BUILT = 'built.' + NAMESPACE;
  var EVENT_SHOW = 'show.' + NAMESPACE;
  var EVENT_SHOWN = 'shown.' + NAMESPACE;
  var EVENT_HIDE = 'hide.' + NAMESPACE;
  var EVENT_HIDDEN = 'hidden.' + NAMESPACE;
  var EVENT_VIEW = 'view.' + NAMESPACE;
  var EVENT_VIEWED = 'viewed.' + NAMESPACE;

  var SUPPORT_TRANSITION = typeof ELEMENT_VIEWER.style.transition !== 'undefined';

  var round = Math.round;
  var sqrt = Math.sqrt;
  var abs = Math.abs;
  var min = Math.min;
  var max = Math.max;
  var num = Number;

  function isString(s) {
    return typeof s === 'string';
  }

  function isNumber(n) {
    return typeof n === 'number' && !isNaN(n);
  }

  function isUndefined(u) {
    return typeof u === 'undefined';
  }

  function toArray(obj, offset) {
    var args = [];

    if (isNumber(offset)) { 
      args.push(offset);
    }

    return args.slice.apply(obj, args);
  }

  function proxy(fn, context) {
    var args = toArray(arguments, 2);

    return function () {
      return fn.apply(context, args.concat(toArray(arguments)));
    };
  }

  function getTransform(options) {
    var transforms = [];
    var rotate = options.rotate;
    var scaleX = options.scaleX;
    var scaleY = options.scaleY;

    if (isNumber(rotate)) {
      transforms.push('rotate(' + rotate + 'deg)');
    }

    if (isNumber(scaleX) && isNumber(scaleY)) {
      transforms.push('scale(' + scaleX + ',' + scaleY + ')');
    }

    return transforms.length ? transforms.join(' ') : 'none';
  }

  function forceReflow(element) {
    return element.offsetWidth;
  }

  function getImageName(url) {
    return isString(url) ? url.replace(/^.*\//, '').replace(/[\?&#].*$/, '') : '';
  }

  function getImageSize(image, callback) {
    var newImage;

    if (image.naturalWidth) {
      return callback(image.naturalWidth, image.naturalHeight);
    }

    newImage = document.createElement('img');

    newImage.onload = function () {
      callback(this.width, this.height);
    };

    newImage.src = image.src;
  }

  function getTouchesCenter(touches) {
    var length = touches.length;
    var pageX = 0;
    var pageY = 0;

    if (length) {
      $.each(touches, function (i, touch) {
        pageX += touch.pageX;
        pageY += touch.pageY;
      });

      pageX /= length;
      pageY /= length;
    }

    return {
      pageX: pageX,
      pageY: pageY
    };
  }

  function getResponsiveClass(option) {
    switch (option) {
      case 2:
        return CLASS_HIDE_XS_DOWN;

      case 3:
        return CLASS_HIDE_SM_DOWN;

      case 4:
        return CLASS_HIDE_MD_DOWN;
    }
  }

  function Viewer(element, options) {
    this.$element = $(element);
    this.options = $.extend({}, Viewer.DEFAULTS, $.isPlainObject(options) && options);
    this.isImg = false;
    this.isBuilt = false;
    this.isShown = false;
    this.isViewed = false;
    this.isFulled = false;
    this.isPlayed = false;
    this.wheeling = false;
    this.playing = false;
    this.fading = false;
    this.tooltiping = false;
    this.transitioning = false;
    this.action = false;
    this.target = false;
    this.timeout = false;
    this.index = 0;
    this.length = 0;
    this.init();
  }

  Viewer.prototype = {
    constructor: Viewer,

    init: function () {
      var options = this.options;
      var $this = this.$element;
      var isImg = $this.is(SELECTOR_IMG);
      var $images = isImg ? $this : $this.find(SELECTOR_IMG);
      var length = $images.length;
      var ready = $.proxy(this.ready, this);

      if (!length) {
        return;
      }

      if ($.isFunction(options.build)) {
        $this.one(EVENT_BUILD, options.build);
      }

      if (this.trigger(EVENT_BUILD).isDefaultPrevented()) {
        return;
      }

      if (!SUPPORT_TRANSITION) {
        options.transition = false;
      }

      this.isImg = isImg;
      this.length = length;
      this.count = 0;
      this.$images = $images;
      this.$body = $('body');

      if (options.inline) {
        $this.one(EVENT_BUILT, $.proxy(function () {
          this.view();
        }, this));

        $images.each(function () {
          if (this.complete) {
            ready();
          } else {
            $(this).one(EVENT_LOAD, ready);
          }
        });
      } else {
        $this.on(EVENT_CLICK, $.proxy(this.start, this));
      }
    },

    ready: function () {
      this.count++;

      if (this.count === this.length) {
        this.build();
      }
    },

    build: function () {
      var options = this.options;
      var $this = this.$element;
      var $parent;
      var $viewer;
      var $title;
      var $toolbar;
      var $navbar;
      var $button;

      if (this.isBuilt) {
        return;
      }

      this.$parent = $parent = $this.parent();
      this.$viewer = $viewer = $(Viewer.TEMPLATE);
      this.$canvas = $viewer.find('.viewer-canvas');
      this.$footer = $viewer.find('.viewer-footer');
      this.$title = $title = $viewer.find('.viewer-title');
      this.$toolbar = $toolbar = $viewer.find('.viewer-toolbar');
      this.$navbar = $navbar = $viewer.find('.viewer-navbar');
      this.$button = $button = $viewer.find('.viewer-button');
      this.$tooltip = $viewer.find('.viewer-tooltip');
      this.$player = $viewer.find('.viewer-player');
      this.$list = $viewer.find('.viewer-list');

      $title.addClass(!options.title ? CLASS_HIDE : getResponsiveClass(options.title));

      $toolbar.addClass(!options.toolbar ? CLASS_HIDE : getResponsiveClass(options.toolbar));
      $toolbar.find('li[class*=zoom]').toggleClass(CLASS_INVISIBLE, !options.zoomable);
      $toolbar.find('li[class*=flip]').toggleClass(CLASS_INVISIBLE, !options.scalable);

      if (!options.rotatable) {
        $toolbar.find('li[class*=rotate]').addClass(CLASS_INVISIBLE).appendTo($toolbar);
      }

      $navbar.addClass(!options.navbar ? CLASS_HIDE : getResponsiveClass(options.navbar));

      if (options.inline) {
        $button.addClass(CLASS_FULLSCREEN);
        $viewer.css('z-index', options.zIndexInline);

        if ($parent.css('position') === 'static') {
          $parent.css('position', 'relative');
        }
      } else {
        $button.addClass(CLASS_CLOSE);
        $viewer.
          css('z-index', options.zIndex).
          addClass([CLASS_FIXED, CLASS_FADE, CLASS_HIDE].join(' '));
      }

      $this.after($viewer);

      if (options.inline) {
        this.render();
        this.bind();
        this.isShown = true;
      }

      this.isBuilt = true;

      if ($.isFunction(options.built)) {
        $this.one(EVENT_BUILT, options.built);
      }

      this.trigger(EVENT_BUILT);
    },

    unbuild: function () {
      var options = this.options;
      var $this = this.$element;

      if (!this.isBuilt) {
        return;
      }

      if (options.inline) {
        $this.removeClass(CLASS_HIDE);
      }

      this.$viewer.remove();
    },

    bind: function () {
      var options = this.options;
      var $this = this.$element;

      if ($.isFunction(options.view)) {
        $this.on(EVENT_VIEW, options.view);
      }

      if ($.isFunction(options.viewed)) {
        $this.on(EVENT_VIEWED, options.viewed);
      }

      this.$viewer.
        on(EVENT_CLICK, $.proxy(this.click, this)).
        on(EVENT_WHEEL, $.proxy(this.wheel, this));

      this.$canvas.on(EVENT_MOUSEDOWN, $.proxy(this.mousedown, this));

      $document.
        on(EVENT_MOUSEMOVE, (this._mousemove = proxy(this.mousemove, this))).
        on(EVENT_MOUSEUP, (this._mouseup = proxy(this.mouseup, this))).
        on(EVENT_KEYDOWN, (this._keydown = proxy(this.keydown, this)));

      $window.on(EVENT_RESIZE, (this._resize = proxy(this.resize, this)));
    },

    unbind: function () {
      var options = this.options;
      var $this = this.$element;

      if ($.isFunction(options.view)) {
        $this.off(EVENT_VIEW, options.view);
      }

      if ($.isFunction(options.viewed)) {
        $this.off(EVENT_VIEWED, options.viewed);
      }

      this.$viewer.
        off(EVENT_CLICK, this.click).
        off(EVENT_WHEEL, this.wheel);

      this.$canvas.off(EVENT_MOUSEDOWN, this.mousedown);

      $document.
        off(EVENT_MOUSEMOVE, this._mousemove).
        off(EVENT_MOUSEUP, this._mouseup).
        off(EVENT_KEYDOWN, this._keydown);

      $window.off(EVENT_RESIZE, this._resize);
    },

    render: function () {
      this.initContainer();
      this.initViewer();
      this.initList();
      this.renderViewer();
    },

    initContainer: function () {
      this.container = {
        width: $window.innerWidth(),
        height: $window.innerHeight()
      };
    },

    initViewer: function () {
      var options = this.options;
      var $parent = this.$parent;
      var viewer;

      if (options.inline) {
        this.parent = viewer = {
          width: max($parent.width(), options.minWidth),
          height: max($parent.height(), options.minHeight)
        };
      }

      if (this.isFulled || !viewer) {
        viewer = this.container;
      }

      this.viewer = $.extend({}, viewer);
    },

    renderViewer: function () {
      if (this.options.inline && !this.isFulled) {
        this.$viewer.css(this.viewer);
      }
    },

    initList: function () {
      var options = this.options;
      var $this = this.$element;
      var $list = this.$list;
      var list = [];

      this.$images.each(function (i) {
        var src = this.src;
        var alt = this.alt || getImageName(src);
        var url = options.url;

        if (!src) {
          return;
        }

        if (isString(url)) {
          url = this.getAttribute(url);
        } else if ($.isFunction(url)) {
          url = url.call(this, this);
        }

        list.push(
          '<li>' +
            '<img' +
              ' src="' + src + '"' +
              ' data-action="view"' +
              ' data-index="' +  i + '"' +
              ' data-original-url="' +  (url || src) + '"' +
              ' alt="' +  alt + '"' +
            '>' +
          '</li>'
        );
      });

      $list.html(list.join('')).find(SELECTOR_IMG).one(EVENT_LOAD, {
        filled: true
      }, $.proxy(this.loadImage, this));

      this.$items = $list.children();

      if (options.transition) {
        $this.one(EVENT_VIEWED, function () {
          $list.addClass(CLASS_TRANSITION);
        });
      }
    },

    renderList: function (index) {
      var i = index || this.index;
      var width = this.$items.eq(i).width();
      var outerWidth = width + 1; 

      this.$list.css({
        width: outerWidth * this.length,
        marginLeft: (this.viewer.width - width) / 2 - outerWidth * i
      });
    },

    resetList: function () {
      this.$list.empty().removeClass(CLASS_TRANSITION).css('margin-left', 0);
    },

    initImage: function (callback) {
      var options = this.options;
      var $image = this.$image;
      var viewer = this.viewer;
      var footerHeight = this.$footer.height();
      var viewerWidth = viewer.width;
      var viewerHeight = max(viewer.height - footerHeight, footerHeight);
      var oldImage = this.image || {};

      getImageSize($image[0], $.proxy(function (naturalWidth, naturalHeight) {
        var aspectRatio = naturalWidth / naturalHeight;
        var width = viewerWidth;
        var height = viewerHeight;
        var initialImage;
        var image;

        if (viewerHeight * aspectRatio > viewerWidth) {
          height = viewerWidth / aspectRatio;
        } else {
          width = viewerHeight * aspectRatio;
        }

        width = min(width * 0.9, naturalWidth);
        height = min(height * 0.9, naturalHeight);

        image = {
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight,
          aspectRatio: aspectRatio,
          ratio: width / naturalWidth,
          width: width,
          height: height,
          left: (viewerWidth - width) / 2,
          top: (viewerHeight - height) / 2
        };

        initialImage = $.extend({}, image);

        if (options.rotatable) {
          image.rotate = oldImage.rotate || 0;
          initialImage.rotate = 0;
        }

        if (options.scalable) {
          image.scaleX = oldImage.scaleX || 1;
          image.scaleY = oldImage.scaleY || 1;
          initialImage.scaleX = 1;
          initialImage.scaleY = 1;
        }

        this.image = image;
        this.initialImage = initialImage;

        if ($.isFunction(callback)) {
          callback();
        }
      }, this));
    },

    renderImage: function (callback) {
      var image = this.image;
      var $image = this.$image;

      $image.css({
        width: image.width,
        height: image.height,
        marginLeft: image.left,
        marginTop: image.top,
        transform: getTransform(image)
      });

      if ($.isFunction(callback)) {
        if (this.transitioning) {
          $image.one(EVENT_TRANSITIONEND, callback);
        } else {
          callback();
        }
      }
    },

    resetImage: function () {
      this.$image.remove();
      this.$image = null;
    },

    start: function (e) {
      var target = e.target;

      if ($(target).is('img')) {
        this.target = target;
        this.show();
      }
    },

    click: function (e) {
      var $target = $(e.target);
      var action = $target.data('action');
      var image = this.image;

      switch (action) {
        case 'mix':
          if (this.isPlayed) {
            this.stop();
          } else {
            if (this.options.inline) {
              if (this.isFulled) {
                this.exit();
              } else {
                this.full();
              }
            } else {
              this.hide();
            }
          }

          break;

        case 'view':
          this.view($target.data('index'));
          break;

        case 'zoom-in':
          this.zoom(0.1, true);
          break;

        case 'zoom-out':
          this.zoom(-0.1, true);
          break;

        case 'one-to-one':
          this.toggle();
          break;

        case 'reset':
          this.reset();
          break;

        case 'prev':
          this.prev();
          break;

        case 'play':
          this.play();
          break;

        case 'next':
          this.next();
          break;

        case 'rotate-left':
          this.rotate(-90);
          break;

        case 'rotate-right':
          this.rotate(90);
          break;

        case 'flip-horizontal':
          this.scaleX(-image.scaleX || -1);
          break;

        case 'flip-vertical':
          this.scaleY(-image.scaleY || -1);
          break;

        default:
          if (this.isPlayed) {
            this.stop();
          }
      }
    },

    load: function () {
      var options = this.options;
      var viewer = this.viewer;
      var $image = this.$image;

      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = false;
      }

      $image.removeClass(CLASS_INVISIBLE).css('cssText', (
        'width:0;' +
        'height:0;' +
        'margin-left:' + viewer.width / 2 + 'px;' +
        'margin-top:' + viewer.height / 2 + 'px;' +
        'max-width:none!important;' +
        'visibility:visible;'
      ));

      this.initImage($.proxy(function () {
        $image.
          toggleClass(CLASS_TRANSITION, options.transition).
          toggleClass(CLASS_MOVE, options.movable);

        this.renderImage($.proxy(function () {
          this.isViewed = true;
          this.trigger(EVENT_VIEWED);
        }, this));
      }, this));
    },

    loadImage: function (e) {
      var image = e.target;
      var $image = $(image);
      var $parent = $image.parent();
      var parentWidth = $parent.width();
      var parentHeight = $parent.height();
      var filled = e.data && e.data.filled;

      getImageSize(image, function (naturalWidth, naturalHeight) {
        var aspectRatio = naturalWidth / naturalHeight;
        var width = parentWidth;
        var height = parentHeight;

        if (parentHeight * aspectRatio > parentWidth) {
          if (filled) {
            width = parentHeight * aspectRatio;
          } else {
            height = parentWidth / aspectRatio;
          }
        } else {
          if (filled) {
            height = parentWidth / aspectRatio;
          } else {
            width = parentHeight * aspectRatio;
          }
        }

        $image.css({
          width: width,
          height: height,
          marginLeft: (parentWidth - width) / 2,
          marginTop: (parentHeight - height) / 2
        });
      });
    },

    resize: function () {
      this.initContainer();
      this.initViewer();
      this.renderViewer();
      this.renderList();
      this.initImage($.proxy(function () {
        this.renderImage();
      }, this));

      if (this.isPlayed) {
        this.$player.
          find(SELECTOR_IMG).
          one(EVENT_LOAD, $.proxy(this.loadImage, this)).
          trigger(EVENT_LOAD);
      }
    },

    wheel: function (event) {
      var e = event.originalEvent || event;
      var ratio = num(this.options.zoomRatio) || 0.1;
      var delta = 1;

      if (!this.isViewed) {
        return;
      }

      event.preventDefault();

      if (this.wheeling) {
        return;
      }

      this.wheeling = true;

      setTimeout($.proxy(function () {
        this.wheeling = false;
      }, this), 50);

      if (e.deltaY) {
        delta = e.deltaY > 0 ? 1 : -1;
      } else if (e.wheelDelta) {
        delta = -e.wheelDelta / 120;
      } else if (e.detail) {
        delta = e.detail > 0 ? 1 : -1;
      }

      this.zoom(-delta * ratio, true, event);
    },

    keydown: function (e) {
      var options = this.options;
      var which = e.which;

      if (!this.isFulled || !options.keyboard) {
        return;
      }

      switch (which) {

        case 27:
          if (this.isPlayed) {
            this.stop();
          } else {
            if (options.inline) {
              if (this.isFulled) {
                this.exit();
              }
            } else {
              this.hide();
            }
          }

          break;

        case 32:
          if (this.isPlayed) {
            this.stop();
          }

          break;

        case 37:
          this.prev();
          break;

        case 38:

          e.preventDefault();

          this.zoom(options.zoomRatio, true);
          break;

        case 39:
          this.next();
          break;

        case 40:

          e.preventDefault();

          this.zoom(-options.zoomRatio, true);
          break;

        case 48:

        case 49:
          if (e.ctrlKey || e.shiftKey) {
            e.preventDefault();
            this.toggle();
          }

          break;

      }
    },

    mousedown: function (event) {
      var options = this.options;
      var originalEvent = event.originalEvent;
      var touches = originalEvent && originalEvent.touches;
      var e = event;
      var action = options.movable ? 'move' : false;
      var touchesLength;

      if (!this.isViewed) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && touchesLength === 2) {
            e = touches[1];
            this.startX2 = e.pageX;
            this.startY2 = e.pageY;
            action = 'zoom';
          } else {
            return;
          }
        } else {
          if (this.isSwitchable()) {
            action = 'switch';
          }
        }

        e = touches[0];
      }

      if (action) {
        event.preventDefault();
        this.action = action;

        this.startX = e.pageX || originalEvent && originalEvent.pageX;
        this.startY = e.pageY || originalEvent && originalEvent.pageY;
      }
    },

    mousemove: function (event) {
      var options = this.options;
      var action = this.action;
      var $image = this.$image;
      var originalEvent = event.originalEvent;
      var touches = originalEvent && originalEvent.touches;
      var e = event;
      var touchesLength;

      if (!this.isViewed) {
        return;
      }

      if (touches) {
        touchesLength = touches.length;

        if (touchesLength > 1) {
          if (options.zoomable && touchesLength === 2) {
            e = touches[1];
            this.endX2 = e.pageX;
            this.endY2 = e.pageY;
          } else {
            return;
          }
        }

        e = touches[0];
      }

      if (action) {
        event.preventDefault();

        if (action === 'move' && options.transition && $image.hasClass(CLASS_TRANSITION)) {
          $image.removeClass(CLASS_TRANSITION);
        }

        this.endX = e.pageX || originalEvent && originalEvent.pageX;
        this.endY = e.pageY || originalEvent && originalEvent.pageY;

        this.change(event);
      }
    },

    mouseup: function (event) {
      var action = this.action;

      if (action) {
        event.preventDefault();

        if (action === 'move' && this.options.transition) {
          this.$image.addClass(CLASS_TRANSITION);
        }

        this.action = false;
      }
    },

    show: function () {
      var options = this.options;
      var $viewer;

      if (options.inline || this.transitioning) {
        return;
      }

      if (!this.isBuilt) {
        this.build();
      }

      if ($.isFunction(options.show)) {
        this.$element.one(EVENT_SHOW, options.show);
      }

      if (this.trigger(EVENT_SHOW).isDefaultPrevented()) {
        return;
      }

      this.$body.addClass(CLASS_OPEN);
      $viewer = this.$viewer.removeClass(CLASS_HIDE);

      this.$element.one(EVENT_SHOWN, $.proxy(function () {
        this.view(this.target ? this.$images.index(this.target) : this.index);
        this.target = false;
      }, this));

      if (options.transition) {
        this.transitioning = true;
        $viewer.addClass(CLASS_TRANSITION);
        forceReflow($viewer[0]);
        $viewer.one(EVENT_TRANSITIONEND, $.proxy(this.shown, this)).addClass(CLASS_IN);
      } else {
        $viewer.addClass(CLASS_IN);
        this.shown();
      }
    },

    hide: function () {
      var options = this.options;
      var $viewer = this.$viewer;

      if (options.inline || this.transitioning || !this.isShown) {
        return;
      }

      if ($.isFunction(options.hide)) {
        this.$element.one(EVENT_HIDE, options.hide);
      }

      if (this.trigger(EVENT_HIDE).isDefaultPrevented()) {
        return;
      }

      if (this.isViewed && options.transition) {
        this.transitioning = true;
        this.$image.one(EVENT_TRANSITIONEND, $.proxy(function () {
          $viewer.one(EVENT_TRANSITIONEND, $.proxy(this.hidden, this)).removeClass(CLASS_IN);
        }, this));
        this.zoomTo(0, false, false, true);
      } else {
        $viewer.removeClass(CLASS_IN);
        this.hidden();
      }
    },

    view: function (index) {
      var $title = this.$title;
      var $image;
      var $item;
      var $img;
      var url;
      var alt;

      index = Number(index) || 0;

      if (!this.isShown || this.isPlayed || index < 0 || index >= this.length ||
        this.isViewed && index === this.index) {
        return;
      }

      if (this.trigger(EVENT_VIEW).isDefaultPrevented()) {
        return;
      }

      $item = this.$items.eq(index);
      $img = $item.find(SELECTOR_IMG);
      url = $img.data('originalUrl');
      alt = $img.attr('alt');

      this.$image = $image = $('<img src="' + url + '" alt="' + alt + '">');

      if (this.isViewed) {
        this.$items.eq(this.index).removeClass(CLASS_ACTIVE);
      }

      $item.addClass(CLASS_ACTIVE);

      this.isViewed = false;
      this.index = index;
      this.image = null;
      this.$canvas.html($image.addClass(CLASS_INVISIBLE));

      this.renderList();

      $title.empty();

      this.$element.one(EVENT_VIEWED, $.proxy(function () {
        var image = this.image;
        var width = image.naturalWidth;
        var height = image.naturalHeight;

        $title.html(alt + ' (' + width + ' &times; ' + height + ')');
      }, this));

      if ($image[0].complete) {
        this.load();
      } else {
        $image.one(EVENT_LOAD, $.proxy(this.load, this));

        if (this.timeout) {
          clearTimeout(this.timeout);
        }

        this.timeout = setTimeout($.proxy(function () {
          $image.removeClass(CLASS_INVISIBLE);
          this.timeout = false;
        }, this), 1000);
      }
    },

    prev: function () {
      this.view(max(this.index - 1, 0));
    },

    next: function () {
      this.view(min(this.index + 1, this.length - 1));
    },

    move: function (offsetX, offsetY) {
      var image = this.image;

      this.moveTo(
        isUndefined(offsetX) ? offsetX : image.left + num(offsetX),
        isUndefined(offsetY) ? offsetY : image.top + num(offsetY)
      );
    },

    moveTo: function (x, y) {
      var image = this.image;
      var changed = false;

      if (isUndefined(y)) {
        y = x;
      }

      x = num(x);
      y = num(y);

      if (this.isViewed && !this.isPlayed && this.options.movable) {
        if (isNumber(x)) {
          image.left = x;
          changed = true;
        }

        if (isNumber(y)) {
          image.top = y;
          changed = true;
        }

        if (changed) {
          this.renderImage();
        }
      }
    },

    zoom: function (ratio, hasTooltip, _event) {
      var image = this.image;

      ratio = num(ratio);

      if (ratio < 0) {
        ratio =  1 / (1 - ratio);
      } else {
        ratio = 1 + ratio;
      }

      this.zoomTo(image.width * ratio / image.naturalWidth, hasTooltip, _event);
    },

    zoomTo: function (ratio, hasTooltip, _event, _zoomable) {
      var options = this.options;
      var minZoomRatio = 0.01;
      var maxZoomRatio = 100;
      var image = this.image;
      var width = image.width;
      var height = image.height;
      var originalEvent;
      var newWidth;
      var newHeight;
      var offset;
      var center;

      ratio = max(0, ratio);

      if (isNumber(ratio) && this.isViewed && !this.isPlayed && (_zoomable || options.zoomable)) {
        if (!_zoomable) {
          minZoomRatio = max(minZoomRatio, options.minZoomRatio);
          maxZoomRatio = min(maxZoomRatio, options.maxZoomRatio);
          ratio = min(max(ratio, minZoomRatio), maxZoomRatio);
        }

        if (ratio > 0.95 && ratio < 1.05) {
          ratio = 1;
        }

        newWidth = image.naturalWidth * ratio;
        newHeight = image.naturalHeight * ratio;

        if (_event && (originalEvent = _event.originalEvent)) {
          offset = this.$viewer.offset();
          center = originalEvent.touches ? getTouchesCenter(originalEvent.touches) : {
            pageX: _event.pageX || originalEvent.pageX || 0,
            pageY: _event.pageY || originalEvent.pageY || 0
          };

          image.left -= (newWidth - width) * (
            ((center.pageX - offset.left) - image.left) / width
          );
          image.top -= (newHeight - height) * (
            ((center.pageY - offset.top) - image.top) / height
          );
        } else {

          image.left -= (newWidth - width) / 2;
          image.top -= (newHeight - height) / 2;
        }

        image.width = newWidth;
        image.height = newHeight;
        image.ratio = ratio;
        this.renderImage();

        if (hasTooltip) {
          this.tooltip();
        }
      }
    },

    rotate: function (degree) {
      this.rotateTo((this.image.rotate || 0) + num(degree));
    },

    rotateTo: function (degree) {
      var image = this.image;

      degree = num(degree);

      if (isNumber(degree) && this.isViewed && !this.isPlayed && this.options.rotatable) {
        image.rotate = degree;
        this.renderImage();
      }
    },

    scale: function (scaleX, scaleY) {
      var image = this.image;
      var changed = false;

      if (isUndefined(scaleY)) {
        scaleY = scaleX;
      }

      scaleX = num(scaleX);
      scaleY = num(scaleY);

      if (this.isViewed && !this.isPlayed && this.options.scalable) {
        if (isNumber(scaleX)) {
          image.scaleX = scaleX;
          changed = true;
        }

        if (isNumber(scaleY)) {
          image.scaleY = scaleY;
          changed = true;
        }

        if (changed) {
          this.renderImage();
        }
      }
    },

    scaleX: function (scaleX) {
      this.scale(scaleX, this.image.scaleY);
    },

    scaleY: function (scaleY) {
      this.scale(this.image.scaleX, scaleY);
    },

    play: function () {
      var options = this.options;
      var $player = this.$player;
      var load = $.proxy(this.loadImage, this);
      var list = [];
      var total = 0;
      var index = 0;
      var playing;

      if (!this.isShown || this.isPlayed) {
        return;
      }

      if (options.fullscreen) {
        this.requestFullscreen();
      }

      this.isPlayed = true;
      $player.addClass(CLASS_SHOW);

      this.$items.each(function (i) {
        var $this = $(this);
        var $img = $this.find(SELECTOR_IMG);
        var $image = $('<img src="' + $img.data('originalUrl') + '" alt="' + $img.attr('alt') + '">');

        total++;

        $image.addClass(CLASS_FADE).toggleClass(CLASS_TRANSITION, options.transition);

        if ($this.hasClass(CLASS_ACTIVE)) {
          $image.addClass(CLASS_IN);
          index = i;
        }

        list.push($image);
        $image.one(EVENT_LOAD, {
          filled: false
        }, load);
        $player.append($image);
      });

      if (isNumber(options.interval) && options.interval > 0) {
        playing = $.proxy(function () {
          this.playing = setTimeout(function () {
            list[index].removeClass(CLASS_IN);
            index++;
            index = index < total ? index : 0;
            list[index].addClass(CLASS_IN);

            playing();
          }, options.interval);
        }, this);

        if (total > 1) {
          playing();
        }
      }
    },

    stop: function () {
      if (!this.isPlayed) {
        return;
      }

      if (this.options.fullscreen) {
        this.exitFullscreen();
      }

      this.isPlayed = false;
      clearTimeout(this.playing);
      this.$player.removeClass(CLASS_SHOW).empty();
    },

    full: function () {
      var options = this.options;
      var $image = this.$image;
      var $list = this.$list;

      if (!this.isShown || this.isPlayed || this.isFulled || !options.inline) {
        return;
      }

      this.isFulled = true;
      this.$body.addClass(CLASS_OPEN);
      this.$button.addClass(CLASS_FULLSCREEN_EXIT);

      if (options.transition) {
        $image.removeClass(CLASS_TRANSITION);
        $list.removeClass(CLASS_TRANSITION);
      }

      this.$viewer.addClass(CLASS_FIXED).removeAttr('style').css('z-index', options.zIndex);
      this.initContainer();
      this.viewer = $.extend({}, this.container);
      this.renderList();
      this.initImage($.proxy(function () {
        this.renderImage(function () {
          if (options.transition) {
            setTimeout(function () {
              $image.addClass(CLASS_TRANSITION);
              $list.addClass(CLASS_TRANSITION);
            }, 0);
          }
        });
      }, this));
    },

    exit: function () {
      var options = this.options;
      var $image = this.$image;
      var $list = this.$list;

      if (!this.isFulled) {
        return;
      }

      this.isFulled = false;
      this.$body.removeClass(CLASS_OPEN);
      this.$button.removeClass(CLASS_FULLSCREEN_EXIT);

      if (options.transition) {
        $image.removeClass(CLASS_TRANSITION);
        $list.removeClass(CLASS_TRANSITION);
      }

      this.$viewer.removeClass(CLASS_FIXED).css('z-index', options.zIndexInline);
      this.viewer = $.extend({}, this.parent);
      this.renderViewer();
      this.renderList();
      this.initImage($.proxy(function () {
        this.renderImage(function () {
          if (options.transition) {
            setTimeout(function () {
              $image.addClass(CLASS_TRANSITION);
              $list.addClass(CLASS_TRANSITION);
            }, 0);
          }
        });
      }, this));
    },

    tooltip: function () {
      var options = this.options;
      var $tooltip = this.$tooltip;
      var image = this.image;
      var classes = [
            CLASS_SHOW,
            CLASS_FADE,
            CLASS_TRANSITION
          ].join(' ');

      if (!this.isViewed || this.isPlayed || !options.tooltip) {
        return;
      }

      $tooltip.text(round(image.ratio * 100) + '%');

      if (!this.tooltiping) {
        if (options.transition) {
          if (this.fading) {
            $tooltip.trigger(EVENT_TRANSITIONEND);
          }

          $tooltip.addClass(classes);
          forceReflow($tooltip[0]);
          $tooltip.addClass(CLASS_IN);
        } else {
          $tooltip.addClass(CLASS_SHOW);
        }
      } else {
        clearTimeout(this.tooltiping);
      }

      this.tooltiping = setTimeout($.proxy(function () {
        if (options.transition) {
          $tooltip.one(EVENT_TRANSITIONEND, $.proxy(function () {
            $tooltip.removeClass(classes);
            this.fading = false;
          }, this)).removeClass(CLASS_IN);

          this.fading = true;
        } else {
          $tooltip.removeClass(CLASS_SHOW);
        }

        this.tooltiping = false;
      }, this), 1000);
    },

    toggle: function () {
      if (this.image.ratio === 1) {
        this.zoomTo(this.initialImage.ratio, true);
      } else {
        this.zoomTo(1, true);
      }
    },

    reset: function () {
      if (this.isViewed && !this.isPlayed) {
        this.image = $.extend({}, this.initialImage);
        this.renderImage();
      }
    },

    update: function () {
      var $this = this.$element;
      var $images = this.$images;
      var indexes = [];
      var index;

      if (this.isImg) {

        if (!$this.parent().length) {
          return this.destroy();
        }
      } else {
        this.$images = $images = $this.find(SELECTOR_IMG);
        this.length = $images.length;
      }

      if (this.isBuilt) {
        $.each(this.$items, function (i) {
          var img = $(this).find('img')[0];
          var image = $images[i];

          if (image) {
            if (image.src !== img.src) {
              indexes.push(i);
            }
          } else {
            indexes.push(i);
          }
        });

        this.$list.width('auto');
        this.initList();

        if (this.isShown) {
          if (this.length) {
            if (this.isViewed) {
              index = $.inArray(this.index, indexes);

              if (index >= 0) {
                this.isViewed = false;
                this.view(max(this.index - (index + 1), 0));
              } else {
                this.$items.eq(this.index).addClass(CLASS_ACTIVE);
              }
            }
          } else {
            this.$image = null;
            this.isViewed = false;
            this.index = 0;
            this.image = null;
            this.$canvas.empty();
            this.$title.empty();
          }
        }
      }
    },

    destroy: function () {
      var $this = this.$element;

      if (this.options.inline) {
        this.unbind();
      } else {
        if (this.isShown) {
          this.unbind();
        }

        $this.off(EVENT_CLICK, this.start);
      }

      this.unbuild();
      $this.removeData(NAMESPACE);
    },

    trigger: function (type, data) {
      var e = $.Event(type, data);

      this.$element.trigger(e);

      return e;
    },

    shown: function () {
      var options = this.options;

      this.transitioning = false;
      this.isFulled = true;
      this.isShown = true;
      this.isVisible = true;
      this.render();
      this.bind();

      if ($.isFunction(options.shown)) {
        this.$element.one(EVENT_SHOWN, options.shown);
      }

      this.trigger(EVENT_SHOWN);
    },

    hidden: function () {
      var options = this.options;

      this.transitioning = false;
      this.isViewed = false;
      this.isFulled = false;
      this.isShown = false;
      this.isVisible = false;
      this.unbind();
      this.$body.removeClass(CLASS_OPEN);
      this.$viewer.addClass(CLASS_HIDE);
      this.resetList();
      this.resetImage();

      if ($.isFunction(options.hidden)) {
        this.$element.one(EVENT_HIDDEN, options.hidden);
      }

      this.trigger(EVENT_HIDDEN);
    },

    requestFullscreen: function () {
      var documentElement = document.documentElement;

      if (this.isFulled && !document.fullscreenElement && !document.mozFullScreenElement &&
        !document.webkitFullscreenElement && !document.msFullscreenElement) {

        if (documentElement.requestFullscreen) {
          documentElement.requestFullscreen();
        } else if (documentElement.msRequestFullscreen) {
          documentElement.msRequestFullscreen();
        } else if (documentElement.mozRequestFullScreen) {
          documentElement.mozRequestFullScreen();
        } else if (documentElement.webkitRequestFullscreen) {
          documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
      }
    },

    exitFullscreen: function () {
      if (this.isFulled) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    },

    change: function (event) {
      var offsetX = this.endX - this.startX;
      var offsetY = this.endY - this.startY;

      switch (this.action) {

        case 'move':
          this.move(offsetX, offsetY);
          break;

        case 'zoom':
          this.zoom(function (x1, y1, x2, y2) {
            var z1 = sqrt(x1 * x1 + y1 * y1);
            var z2 = sqrt(x2 * x2 + y2 * y2);

            return (z2 - z1) / z1;
          }(
            abs(this.startX - this.startX2),
            abs(this.startY - this.startY2),
            abs(this.endX - this.endX2),
            abs(this.endY - this.endY2)
          ), false, event);

          this.startX2 = this.endX2;
          this.startY2 = this.endY2;
          break;

        case 'switch':
          this.action = 'switched';

          if (abs(offsetX) > abs(offsetY)) {
            if (offsetX > 1) {
              this.prev();
            } else if (offsetX < -1) {
              this.next();
            }
          }

          break;

      }

      this.startX = this.endX;
      this.startY = this.endY;
    },

    isSwitchable: function () {
      var image = this.image;
      var viewer = this.viewer;

      return (image.left >= 0 && image.top >= 0 && image.width <= viewer.width &&
        image.height <= viewer.height);
    }
  };

  Viewer.DEFAULTS = {
    inline: false,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    interval: 5000,
    minWidth: 200,
    minHeight: 100,
    zoomRatio: 0.1,
    minZoomRatio: 0.01,
    maxZoomRatio: 100,
    zIndex: 2015,
    zIndexInline: 0,
    url: 'src',
    build: null,
    built: null,
    show: null,
    shown: null,
    hide: null,
    hidden: null,
    view: null,
    viewed: null
  };

  Viewer.TEMPLATE = (
    '<div class="viewer-container">' +
      '<div class="viewer-canvas"></div>' +
      '<div class="viewer-footer">' +
        '<div class="viewer-title"></div>' +
        '<ul class="viewer-toolbar">' +
          '<li class="viewer-zoom-in" data-action="zoom-in"></li>' +
          '<li class="viewer-zoom-out" data-action="zoom-out"></li>' +
          '<li class="viewer-one-to-one" data-action="one-to-one"></li>' +
          '<li class="viewer-reset" data-action="reset"></li>' +
          '<li class="viewer-prev" data-action="prev"></li>' +
          '<li class="viewer-play" data-action="play"></li>' +
          '<li class="viewer-next" data-action="next"></li>' +
          '<li class="viewer-rotate-left" data-action="rotate-left"></li>' +
          '<li class="viewer-rotate-right" data-action="rotate-right"></li>' +
          '<li class="viewer-flip-horizontal" data-action="flip-horizontal"></li>' +
          '<li class="viewer-flip-vertical" data-action="flip-vertical"></li>' +
        '</ul>' +
        '<div class="viewer-navbar">' +
          '<ul class="viewer-list"></ul>' +
        '</div>' +
      '</div>' +
      '<div class="viewer-tooltip"></div>' +
      '<div class="viewer-button" data-action="mix"></div>' +
      '<div class="viewer-player"></div>' +
    '</div>'
  );

  Viewer.other = $.fn.viewer;

  $.fn.viewer = function (options) {
    var args = toArray(arguments, 1);
    var result;

    this.each(function () {
      var $this = $(this);
      var data = $this.data(NAMESPACE);
      var fn;

      if (!data) {
        if (/destroy|hide|exit|stop|reset/.test(options)) {
          return;
        }

        $this.data(NAMESPACE, (data = new Viewer(this, options)));
      }

      if (isString(options) && $.isFunction(fn = data[options])) {
        result = fn.apply(data, args);
      }
    });

    return isUndefined(result) ? this : result;
  };

  $.fn.viewer.Constructor = Viewer;
  $.fn.viewer.setDefaults = Viewer.setDefaults;

  $.fn.viewer.noConflict = function () {
    $.fn.viewer = Viewer.other;
    return this;
  };

});