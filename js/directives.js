'use strict';
/* Directives */
angular.module('taxiDirectives', [])
  .directive('beginTrip', function () {
      return {
          restrict: 'A',
          link: function (scope, elem, attrs) {
              alert('directive');
              scope.initialize();
          }
      }
  })
.directive('endTrip', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            alert('directive');
        }
    }
})
.directive('beginDay', function(){
    return{
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs) {
            alert("im here");
            scope.timeCreated = "11:21AM";
        }
    }
})