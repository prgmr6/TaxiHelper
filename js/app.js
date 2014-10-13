'use strict';

/// <summary>
/// App Module for project
/// </summary>
/// <param name="ngRoute">Angular object for routing</param>
/// <param name="taxiAnimations">Animations object injected into App</param>
/// <param name="taxiControllers">Controllers object injected into App</param>
/// <param name="taxiServices">Services object injected into App</param>
/// <param name="taxiFilters">Filters object injected into App</param>
/// <param name="taxiDirectives">Directives object injected into App</param>
/// <returns>Appliction Object with injected pieces</returns>
var taxiApp = angular.module('taxiApp', [
  'ngRoute',
  'taxiAnimations',
  'taxiControllers',
  'taxiServices',
  'taxiFilters',
  'taxiDirectives'
]);

/// <summary>
/// 
/// </summary>
/// <param name="type"></param>
/// <returns></returns>
taxiApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/manifest', {
            templateUrl: 'partials/login.html',
            controller: 'TaxiListCtrl'
        }).
        when('/manifest/menu',{
            templateUrl: 'partials/manifest-header.html',
            controller: 'TaxiListCtrl'
        }).
        when('/manifest/create', {
            templateUrl: 'partials/create.html',
            controller: 'TaxiListCtrl'
        }).
        when('/manifest/end', {
            templateUrl: 'partials/end.html',
            controller: 'TaxiListCtrl'
        }).
        when('/manifest/view', {
              templateUrl: 'partials/view.html',
              controller: 'TaxiListCtrl'
        }).
        when('/manifest/from', {
              templateUrl: 'partials/from.html',
              controller: 'TaxiListCtrl'
        }).
        when('/manifest/general', {
              templateUrl: 'partials/general.html',
              controller: 'InformationCtrl'
        }).
        when('/manifest/nzm', {
            templateUrl: 'partials/zones.html',
            controller: 'InformationCtrl'
        }).
        otherwise({
            redirectTo: '/manifest'
        });
  }]);