angular.module('taxiFilters', []).filter('checkmark', function () {
    return function (input) {
        return input ? '\u2713' : '\u2718';
    };
});


//angular.module('phonecatFilters', []).filter('dateFilter', function () {
//    alert('here i am');
//    //var angularDateFilter = $filter('query');
//    return function (theDate) {
//        alert(input);
//        return angularDateFilter(theDate, 'YYYY-dd-MM');
//    }
//});

//.filter('myDate', function($filter) {    
//    var angularDateFilter = $filter('date');
//    return function(theDate) {
//        return angularDateFilter(theDate, 'dd MMMM @ HH:mm:ss');
//    }
//});
angular.module('taxiFilters', []).filter("textFilter", function () {
    return function (input, text) {
        var sorted = [];

        if (input) {
            if (!input.$getIndex || typeof input.$getIndex != "function") {
                // input is not an angularFire instance
                if (angular.isArray(input)) {
                    // If input is an array, copy it
                    sorted = input.slice(0);
                } else if (angular.isObject(input)) {
                    // If input is an object, map it to an array
                    angular.forEach(input, function (prop) {
                        if (text == prop.date) {
                            sorted.push(prop);
                        }
                    });
                }
            } else {
                // input is an angularFire instance
                var index = input.$getIndex();
                if (index.length > 0) {
                    for (var i = 0; i < index.length; i++) {
                        var val = input[index[i]];
                        if (val) {
                            val.$id = index[i];

                            if (text && text.length > 0 && val.body.indexOf(text) > -1) {
                                sorted.push(val);
                            } else {

                                if (!text || text.length === 0) {
                                    sorted.push(val);
                                }
                            }
                            //
                        }
                    }
                }
            }
        }

        return sorted;
    };
});