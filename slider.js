/*!
 * Slider v0.1.1
 * https://github.com/fengyuanchen/slider
 *
 * Copyright (c) 2014-2016 Fengyuan Chen
 * Released under the MIT license
 *
 * Date: 2016-05-27T09:58:41.538Z
 */

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as anonymous module.
    define('slider', ['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node / CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals.
    factory(jQuery);
  }
})(function ($) {

  'use strict';

  var NAMESPACE = 'slider';

  function isNumber(n) {
    return typeof n === 'number';
  }

  function isString(n) {
    return typeof n === 'string';
  }

  function isUndefined(n) {
    return typeof n === 'undefined';
  }

  function toArray(obj, offset) {
    var args = [];

    // This is necessary for IE8
    if (isNumber(offset)) {
      args.push(offset);
    }

    return args.slice.apply(obj, args);
  }

  function Slider(element, options) {
    var self = this;

    self.$element = $(element);
    self.options = $.extend({}, Slider.DEFAULTS, $.isPlainObject(options) ? options : {});
    self.init();
  }

  Slider.prototype = {
    constructor: Slider,

    init: function () {
      var self = this;
      var $this = self.$element;
      var options = self.options;
      var styles = {
        overflow: 'hidden'
      };

      self.$content = $this.find('.' + options.contentClass);
      self.$items = self.$content.children();

      self.$nav = $this.find('.' + options.navClass);
      self.$btns = self.$nav.children();

      self.$prev = $this.find('.' + options.prevClass);
      self.$next = $this.find('.' + options.nextClass);

      if ($this.css('position') === 'static') {
        styles.position = 'relative';
      }

      $this.css(styles);

      self.index = 0;
      self.length = 1;

      if (self.$items.length > 1) {
        self.render();
      }
    },

    render: function () {
      var self = this;
      var $this = self.$element;
      var options = self.options;
      var firstItem = self.$items.first();

      firstItem.removeAttr('style');
      self.itemHeight = firstItem.height();
      self.itemWidth = firstItem.width();
      self.itemLength = self.$items.length;

      self.width = $this.width();
      self.height = $this.height();

      if (options.effect.toLowerCase() === 'scrollx') {
        self.scrollX();
      } else if (options.effect.toLowerCase() === 'scrolly') {
        self.scrollY();
      } else {
        self.fade();
      }

      self.firstIndexOflastView = self.itemLength - (self.itemLength % self.length || self.length);
      self.enable();

      if (options.autoPlay || options.autoplay) {
        self.start();
      }
    },

    rerender: function () {
      var self = this;
      var $this = self.$element;

      if ($this.width() !== self.width || $this.height() !== self.height) {
        self.stop();
        self.render();
      }
    },

    fade: function () {
      var self = this;

      if (self.$content.css('position') === 'static') {
        self.$content.css('position', 'relative');
      }

      self.$items.css({
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'none',
        width: self.itemWidth,
        height: self.itemHeight
      }).first().show();

      self.sliding = function () {
        var speed = self.options.speed;
        var easing = self.options.easing;

        self.$items.stop(true).fadeOut(speed, easing).eq(self.index).fadeIn(speed, easing);
      };
    },

    scrollX: function () {
      var self = this;

      self.length = Math.floor(self.width / self.itemWidth);

      self.$items.css({
        float: 'left',
        width: self.itemWidth,
        height: self.itemHeight
      });

      self.$content.css({
        position: 'absolute',
        left: 0,
        top: 0,
        width: self.itemWidth * (self.itemLength + 1),
        height: self.itemHeight
      });

      self.sliding = function () {
        self.$content.stop(true).animate({
          left: -self.itemWidth * self.index
        }, self.options.speed, self.options.easing);
      };
    },

    scrollY: function () {
      var self = this;

      self.length = Math.floor(self.height / self.itemHeight);

      self.$items.css({
        width: self.itemWidth,
        height: self.itemHeight
      });

      self.$content.css({
        height: self.itemHeight * (self.itemLength + 1),
        position: 'absolute',
        top: 0,
        left: 0
      });

      self.sliding = function () {
        self.$content.stop(true).animate({
          top: -self.itemHeight * self.index
        }, self.options.speed, self.options.easing);
      };
    },

    enable: function () {
      var self = this;

      if (self.active) {
        return;
      }

      self.active = true;

      self.$element.on({
        mouseover: $.proxy(self.stop, self),
        mouseout: $.proxy(self.start, self)
      });

      self.$btns.on(self.options.trigger, function () {
        self.index = $(self).index();
        self.slide();
      });

      self.$prev.on('click', $.proxy(self.prev, self));
      self.$next.on('click', $.proxy(self.next, self));

      $(window).on('resize', $.proxy(self.resize, self));
    },

    disable: function () {
      var self = this;

      if (!self.active) {
        return;
      }

      self.active = false;
      self.stop();

      self.$element.off({
        mouseover: self.stop,
        mouseout: self.start
      });

      self.$btns.off(self.options.trigger);

      self.$prev.off('click', self.prev);
      self.$next.off('click', self.next);

      $(window).off('resize', self.resize);
    },

    resize: function () {
      var self = this;

      if (self.resizing) {
        clearTimeout(self.resizing);
        self.resizing = null;
      }

      self.resizing = setTimeout($.proxy(self.rerender, self), 200);
    },

    start: function () {
      var self = this;

      if (self.active && !self.autoSlided) {
        self.autoSlided = true;
        self.autoSliding = setInterval($.proxy(self.next, self), self.options.duration);
      }
    },

    stop: function () {
      var self = this;

      if (self.autoSlided) {
        self.autoSlided = false;
        clearInterval(self.autoSliding);
      }
    },

    prev: function () {
      var self = this;
      var prev = self.index - self.length;
      var index;

      if (prev < 0) {
        if (self.options.effect === 'fade') {
          index = self.firstIndexOflastView;
        } else {
          index = 0;
        }
      } else {
        index = prev;
      }

      self.index = index;
      self.slide();
    },

    next: function () {
      var self = this;
      var next = self.index + self.length;
      var index;

      if (next <= self.firstIndexOflastView) {
        index = next;
      } else if (self.autoSlided || self.options.effect === 'fade') {
        index = 0;
      } else {
        index = self.firstIndexOflastView;
      }

      self.index = index;
      self.slide();
    },

    prevable: function () {
      var self = this;
      var prevable = self.index > 0;

      self.$prev.toggleClass(self.options.disableClass, !prevable);

      return prevable;
    },

    nextable: function () {
      var self = this;
      var nextable = self.index < self.firstIndexOflastView;

      self.$next.toggleClass(self.options.disableClass, !nextable);

      return nextable;
    },

    slide: function () {
      var self = this;
      var activeClass = self.options.activeClass;
      var $target = self.$btns.eq(self.index);

      if (!$target.hasClass(activeClass)) {
        $target.addClass(activeClass).siblings().removeClass(activeClass);

        if (self.options.effect !== 'fade') {
          self.prevable();
          self.nextable();
        }

        self.sliding();
      }
    },

    sliding: $.noop,

    destroy: function () {
      var self = this;

      self.disable();
      self.$element.removeData(NAMESPACE);
    }
  };

  
  Slider.DEFAULTS = {
    activeClass: 'slider-active', 
    autoPlay: true,
    contentClass: 'slider-content',
    disableClass: 'slider-disabled', 
    duration: 5000,
    effect: 'fade',
    easing: 'swing', 
    navClass: 'slider-nav',
    nextClass: 'slider-next',
    prevClass: 'slider-prev',
    speed: 1000,
    trigger: 'click' 
  };

  
  Slider.setDefaults = function (options) {
    $.extend(Slider.DEFAULTS, options);
  };

  
  Slider.other = $.fn.slider;

  
  $.fn.slider = function (options) {
    var args = toArray(arguments, 1);
    var result;

    this.each(function () {
      var $this = $(this);
      var data = $this.data(NAMESPACE);
      var fn;

      if (!data) {
        if (/destroy/.test(options)) {
          return;
        }

        $this.data(NAMESPACE, (data = new Slider(this, options)));
      }

      if (isString(options) && $.isFunction(fn = data[options])) {
        result = fn.apply(data, args);
      }
    });

    return isUndefined(result) ? this : result;
  };

  $.fn.slider.Constructor = Slider;
  $.fn.slider.setDefaults = Slider.setDefaults;


  $.fn.slider.noConflict = function () {
    $.fn.slider = Slider.other;
    return this;
  };

  $(function () {
    $('[data-toggle="slider"]').slider();
  });
});