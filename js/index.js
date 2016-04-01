'use strict';

var $ = require('jquery');
require('jquery-mousewheel');

(function ($) {
  $.fn.cardScroll = function (options) {

    var settings = $.extend({
      currentSlide : 0,
      offsetlength : 0,
      transitionShadow : $('.transitionShadow')
    }, options);

    var $selector = $(this.selector);
    var currentElement = $selector[settings.currentSlide];

    $selector.each(function (index) {
      $(this).css('z-index', $selector.length - index);
    })
    settings.transitionShadow.css('z-index', $selector.length - 1);

    $(document).mousewheel(function(e){
        if(e.deltaY < 0) {
            moveUp(e.deltaY);
        }else {
            moveDown(e.deltaY);
        }
        e.preventDefault();
    });

    $(document).on('keydown', function (e) {
      e.preventDefault();
      switch(e.which) {
        case 38:
          prevSlide();
        break;
        case 40:
          nextSlide();
        break;
      }
    })

      function normalizeDelta(e) {
        if (!evt) evt = event;
        var direction = (evt.detail<0 || evt.wheelDelta>0) ? 1 : -1;

      };

      function calculateOffset(delta){
        if ( settings.offsetlength <= 0 && -settings.offsetlength <= window.innerHeight) {
          settings.offsetlength = settings.offsetlength + delta;
          return settings.offsetlength;
        } else if (-settings.offsetlength > window.innerHeight) {
          settings.offsetlength = -window.innerHeight;
          return settings.offsetlength;
        } else {
          settings.offsetlength = 0;
          return settings.offsetlength;
        }
      }

      function moveElement(offset, arrow) {
          //move elements
          $(currentElement).css({
              'transform': 'translateY(' + offset + 'px)',
              'transition': 'transform .1s'
          });
          if (arrow) {
            $(currentElement).css({
                'transition': 'transform 1s'
            });
          }
      }


      function shouldMoveElement(offset) {
          //check to see if element has reached the top or bottom
          //if it has reached the top or bottom, iterate it
          if (offset <= 0 && -offset <= window.innerHeight) {
            return true;
          } else {
            return false;
          }
      }

      function shouldIterateElement(offset, direction){
        //check to see if we've reached the end and can iterate;
        if (-offset >= window.innerHeight && direction === 'up' && settings.currentSlide < $selector.length - 2) {
            return true;
        } else if (offset >= 0 && direction === 'down' && settings.currentSlide > 0) {
          return true;
        } else {
          return false;
        }
      }

      function resetZIndex() {
        settings.transitionShadow.css('z-index', $selector.length - 1 - settings.currentSlide);
      }

      function shadowOpacity(offset, arrow,) {
        var opacity = 1 + (offset / window.innerHeight);
        if (arrow) {
          settings.transitionShadow.css({
            'display': 'none',
          });
        } else {
          settings.transitionShadow.css({
            'opacity': opacity,
            'display': 'block'
        });
        }

      }

      function alignElement(direction) {
        if (direction === 'up') {
          moveElement(-window.innerHeight, true);
        } else {
          moveElement(0, true);
        }
      }

      function iterateElement(direction, e) {
        //align element if needed
        alignElement(direction);
        //iterate element and perform any cleanup
        if (direction === 'up' && settings.currentSlide < $selector.length - 2) {
          settings.currentSlide++;
          resetZIndex();
          currentElement = $selector[settings.currentSlide];
          settings.offsetlength = 0;
        } else if (direction === 'down' && settings.currentSlide > 0) {
          settings.currentSlide--;
          resetZIndex();
          currentElement = $selector[settings.currentSlide];
          settings.offsetlength = -window.innerHeight;
        }
      }

      function moveDown(length) {
        var offset = calculateOffset(length);
        if(shouldMoveElement(offset)) {
          moveElement(offset)
          shadowOpacity(offset);
        } else if (shouldIterateElement(offset, 'down')) {
          iterateElement('down');
        };

      }

      function moveUp(length) {
        var offset = calculateOffset(length);
        if(shouldMoveElement(offset)){
          moveElement(offset);
          shadowOpacity(offset);
        } else if (shouldIterateElement(offset, 'up')) {
            iterateElement('up')
        }
      }

      function prevSlide() {
        moveElement(0, true);
        shadowOpacity(0, true);
        iterateElement('down');
      }

      function nextSlide() {
        moveElement(-window.innerHeight, true);
        shadowOpacity(1, true);
        iterateElement('up');
      }

      return this;
    }

})($);

$(function () {
  $('.section').cardScroll();
})
