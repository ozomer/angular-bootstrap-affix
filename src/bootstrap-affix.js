'use strict';

angular.module('mgcrea.bootstrap.affix', ['mgcrea.jquery'])

  .directive('bsAffix', function($window, $timeout, dimensions) {

    var unpin = null;

    var checkPosition = function(scope, el, options) {

      var scrollTop = window.pageYOffset;
      var scrollHeight = document.body.scrollHeight;
      var position = dimensions.offset.call(el[0]);
      var height = dimensions.height.call(el[0]);
      var parent = el;
      for (var i = 0; i < ((options.offsetParent || 1) * 1); i++) {
        parent = parent.parent();
      }
      var parent_position = dimensions.offset.call(parent[0]);
      var parent_height = dimensions.height.call(parent[0]);


      var offsetTop;
      if ((/^[+-]/).test(options.offsetTop)) {
        offsetTop = parent_position.top + (options.offsetTop * 1);
      }
      else {
        offsetTop = options.offsetTop * 1;
      }
      
      var offsetBottom;
      if ((/^[+-]/).test(options.offsetBottom)) {
        // add 1 pixel due to rounding problems...
        offsetBottom = scrollHeight - (parent_position.top + parent_height + (options.offsetBottom * 1)) + 1;
      }
      else {
        offsetBottom = options.offsetBottom * 1;
      }

      var scope = el.scope();
      if (scope) {
        scope.$apply(function (scope) {
          if (unpin !== null && scrollTop + unpin <= position.top) {
            scope.affix = 'middle';
            unpin = null;
          } else if (offsetBottom && position.top + height >= scrollHeight - offsetBottom) {
            scope.affix = 'bottom';
            if (unpin == null) {
              unpin = position.top - scrollTop;
            }
          } else if (offsetTop && scrollTop <= offsetTop) {
            scope.affix = 'top';
            unpin = null;
          } else {
            scope.affix = 'middle';
            unpin = null;
          }
        });
      }
    };

    return {
      restrict: 'EAC',
      link: function postLink(scope, iElement, iAttrs) {

        angular.element($window).bind('scroll', function() {
          checkPosition(scope, iElement, iAttrs);
        });

        angular.element($window).bind('click', function() {
          $timeout(function() {
            checkPosition(scope, iElement, iAttrs);
          }, 1);
        });

      }
    };

  });
