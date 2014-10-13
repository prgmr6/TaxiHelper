var taxiServices = angular.module('taxiServices', ['ngResource']);

taxiServices.factory('myCache', function ($cacheFactory, $rootScope) {
    return $cacheFactory('myData');
    //var service = {};
    //service.topValue = 0;
    //service.middleValue = 0;
    //service.bottomValue = 0;

    //service.updateTopValue = function (value) {
    //    this.topValue = value;
    //    $rootScope.$broadcast("valuesUpdated");
    //}

    //service.updateMiddleValue = function (value) {
    //    this.middleValue = value;
    //    $rootScope.$broadcast("valuesUpdated");
    //}

    //service.updateBottomValue = function (value) {
    //    this.bottomValue = value;
    //    $rootScope.$broadcast("valuesUpdated");
    //}

    //return service;
});


//angular.module('demoService', []).factory('DemoService', function ($rootScope) {
//    var service = {};
//    service.topValue = 0;
//    service.middleValue = 0;
//    service.bottomValue = 0;

//    service.updateTopValue = function (value) {
//        this.topValue = value;
//        $rootScope.$broadcast("valuesUpdated");
//    }

//    service.updateMiddleValue = function (value) {
//        this.middleValue = value;
//        $rootScope.$broadcast("valuesUpdated");
//    }

//    service.updateBottomValue = function (value) {
//        this.bottomValue = value;
//        $rootScope.$broadcast("valuesUpdated");
//    }

//    return service;
//});

//var demo = angular.module('demo', ['demoService']);