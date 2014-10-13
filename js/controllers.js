var taxiControllers = angular.module('taxiControllers', []);

taxiControllers.controller('InformationCtrl', ['$scope', '$http', '$location', 'myCache', '$window', function ($scope, $http, $location, myCache, $window) {
    $scope.generalInformation = {};
    $scope.numericalZoneListing = {};
    var getGeneralInformationRef = new Firebase('https://blinding-fire-9447.firebaseio.com/Information/General Message Codes');
    var getNumbericalZoneListingRef = new Firebase('https://blinding-fire-9447.firebaseio.com/Information/Numerical Zone LIsting');
    getGeneralInformationRef.on('value', function (snapshot) {
        if (snapshot.val() == null) {  
            // alert('No data at the moment');
        } else {
           $scope.generalInformation = snapshot.val();
        }
    });
    getNumbericalZoneListingRef.on('value', function (snap) {
        if (snap.val() == null) {

        } else {
            $scope.numericalZoneListing = snap.val();
        }
    });
}]);

taxiControllers.controller('TaxiListCtrl', ['$scope', '$http', '$location', 'myCache', '$window', function ($scope, $http, $location, myCache, $window) {

    var cache = myCache.get('myData');
    if (cache) {
        $scope.driver = myCache.get('myData').displayName;
        $scope.email = myCache.get('myData').email;
        $scope.provider = myCache.get('myData').provider;
    }
    $scope.cabno = "1432";
    $scope.tripStarted = false;
    $scope.tripEnded = false;
    $scope.timeCreated = "";
    $scope.daytimeStarted = "";
    $scope.daytimeEnded = "";
    $scope.startAddress = "";
    $scope.endAddress = "";

    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    $scope.currentDate = today;
    var d = new Date();
    var h = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
    if (h == 0) {
        h = 12;
    }
    var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    var ap = d.getHours() > 12 ? " PM" : " AM";
    $scope.timeCreated = h.toString() + ":" + m.toString() + " " + ap;
    $scope.daytimeStarted = h.toString() + ":" + m.toString() + " " + ap;
    $scope.query = today;
    var taxiRef = null;
    $scope.phones = null;
    if ($scope.driver != undefined)
        {
        taxiRef = new Firebase('https://blinding-fire-9447.firebaseio.com/Users/' + $scope.driver + '/Manifests/');
        taxiRef.on('value', function (snapshot) {
            if (snapshot.val() === null) {
                //alert('Data can not be retrieved at the moment. <br/>Wait until data can be retrieved to start the application.');
            } else {
                $scope.phones = snapshot.val();
            }
        });
    }
    var getGeneralInformationRef = new Firebase('https://blinding-fire-9447.firebaseio.com/Information/General Message Codes');
    getGeneralInformationRef.on('value', function (snapshot) {
        if (snapshot.val() == null) {
            // alert('No data at the moment');
        } else {
            $scope.generalInformation = snapshot.val();
        }
    });

    $scope.map;
    $scope.directionsService = new google.maps.DirectionsService();
    $scope.directionsDisplay;
    $scope.maptoaddress1 = " ";
    $scope.maptoaddressnumber = "";
    $scope.maptocity = " ";
    $scope.maptostate = "";
    $scope.maptozip = "";
    $scope.maptocountry = "";
    $scope.mapfromaddress1 = "";
    $scope.mapfromaddressnumber = "";
    $scope.mapfromcity = "";
    $scope.mapfromstate = "";
    $scope.mapfromzip = "";
    $scope.mapfromcountry = "";
    $scope.direction = "";
    $scope.placeSearch = null;
    $scope.autocompleteFrom = null;
    $scope.autocompleteTo = null;
    $scope.componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.checkUser = function () {
        //if ($window.sessionStorage.getItem('driver') == null)
        //    return;
        if (myCache.get('myData') == null)
            return;
        var usersRef = new Firebase('https://blinding-fire-9447.firebaseio.com/Users');
        usersRef.child(myCache.get('myData').displayName).once('value', function (snapshot) {
            var exists = (snapshot.val() !== null);
            if (exists) {
            } else {
                // create false manifest child to get the driver/manifests node into the database
                usersRef.child(myCache.get('driver') + '/Manifests').child('2010-01-01').set({
                    date: '2010-01-01',
                    cabno: "",
                    driver: myCache.get('myData').displayName,
                    daytimeStarted: "",
                    daytimeEnded: "",
                    outUnits: "",
                    outTotalMiles: "",
                    outTrips: "",
                    inUnits: "",
                    inTotalMiles: "",
                    inTrips: "",
                    trips: {}
                });
            }
        });
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.login = function () {
        var chatRef = new Firebase('https://blinding-fire-9447.firebaseio.com');
        var auth = new FirebaseSimpleLogin(chatRef, function (error, user) {
            if (error) {
                // an error occurred while attempting login
                alert(error);
                $location.path('/manifest');
                $scope.$apply();
            } else if (user) {
                var cache = myCache.get('myData');
                if (cache) {
                    $scope.variable = cache;
                }
                else {
                    $scope.User = user;
                    //var utterance = new SpeechSynthesisUtterance('Hello ' + user.displayName);
                    //window.speechSynthesis.speak(utterance);
                    myCache.put('myData', user);
                }
                $scope.GoodLog();
            } else {
                // user is logged out
            }
        });
        // attempt to log the user in with your preferred authentication provider
        auth.login('google', {
            rememberMe: true
        });
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.GoodLog = function () {
        $scope.checkUser();
        $location.path('/manifest/menu');
        $scope.$apply();
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.submitLogin = function () {
        $scope.login();
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.saveManifest = function () {
        sampleChatRef.child($scope.currentDate).set({
            date: $scope.currentDate,
            cabno: $scope.cabno,
            driver: $scope.driver,
            daytimeStarted: $scope.daytimeStarted,
            daytimeEnded: $scope.daytimeEnded,
            outUnits: $scope.outUnits,
            outTotalMiles: $scope.outTotalMiles,
            outTrips: $scope.outTrips,
            inUnits: "",
            inTotalMiles: "",
            inTrips: "",
            trips: {}
        });
        $location.url('/manifest/view');
        $scope.$apply();
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.GetCurrentUserDay = function()
    {
        return new Firebase('https://blinding-fire-9447.firebaseio.com/Users/' + $scope.driver + '/Manifests/' + $scope.currentDate);
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.endManifest = function () {
        var nameRef = $scope.GetCurrentUserDay();
        nameRef.child("inUnits").set($scope.inUnits);
        nameRef.child("inTotalMiles").set($scope.inTotalMiles);
        nameRef.child("inTrips").set($scope.inTrips);
        var d = new Date();
        var h = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
        var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        var ap = d.getHours() > 12 ? " PM" : " AM";
        $scope.daytimeEnded = h.toString() + ":" + m.toString() + ap;
        nameRef.child("daytimeEnded").set($scope.daytimeEnded);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.updateTrip = function () {
        var nameRef = $scope.GetCurrentUserDay();
        var timeStart = $scope.timeStarted;
        var extras = $scope.extras;
        if (extras == undefined) {
            extras = "";
        };
        var comments = $scope.comments;
        if (comments == undefined) {
            comments = "";
        }
        nameRef.child("trips/" + timeStart).set({
                        "endAddress": $scope.maptoaddressnumber + " " + $scope.maptoaddress1,
                        "meterFare": $scope.fare,
                        "passengers": $scope.passengerCount,
                        "startAddress": $scope.mapfromaddressnumber + " " + $scope.mapfromaddress1,
                        "timeEnd": $scope.timeEnded,
                        "timeStart": $scope.timeStarted,
                        "fare": $scope.fare,
                        "extras": extras
                    } );
        nameRef.child("comments").set(comments);
        $location.url('/manifest/view');
        $scope.$apply();
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.stepOne = function () {
        $("#firstPage").show();
        $("#secondPage").hide();
        $("#thirdPage").hide();
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.stepTwo = function () {
        $("#firstPage").hide();
        $("#secondPage").show();
        $("#thirdPage").hide()
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.stepThree = function () {
        $("#firstPage").hide();
        $("#secondPage").hide();
        $("#thirdPage").show();
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.startTime = function () {
        var d = new Date();
        var h = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
        if (h == 0) {
            h = 12;
        }
        var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        var ap = d.getHours() > 12 ? " PM" : " AM";
        $scope.timeStarted = h.toString() + ":" + m.toString() + ap;
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.endTime = function () {
        var d = new Date();
        var h = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
        if (h == 0) {
            h = 12;
        }
        var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        var ap = d.getHours() > 12 ? " PM" : " AM";
        $scope.timeEnded = h.toString() + ":" + m.toString() + ap;
    };
    // start trip, initialize maps and directions service
    $scope.startTrip = function () {
        $scope.direction = "from";
        $scope.initialize();
        $scope.tripStarted = true;
        $scope.tripEnded = false;
       
    };

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.continueTrip = function () {
        $scope.direction = "to";
    };
   
    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.initialize = function () {
        var mapOptions = {
            zoom: 15
        };
        $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);
        $scope.directionsDisplay = new google.maps.DirectionsRenderer();

        $scope.autocompleteFrom = new google.maps.places.Autocomplete(
              (document.getElementById('autocompleteFrom')),
              { types: ['geocode'] });

        $scope.autocompleteTo = new google.maps.places.Autocomplete(
             (document.getElementById('autocompleteTo')),
              { types: ['geocode'] });
        // When the user selects an address from the dropdown,
        //// populate the address fields in the form.
        google.maps.event.addListener($scope.autocompleteFrom, 'place_changed', function () {
            $scope.fillInFromAddress();
        });
        google.maps.event.addListener($scope.autocompleteTo, 'place_changed', function () {
            $scope.fillInToAddress();
        });
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap($scope.map);
        $scope.directionsDisplay.setMap($scope.map);
        // Try HTML5 geolocation
        //if (navigator.geolocation) {
        //    navigator.geolocation.getCurrentPosition(function (position) {
        //        var pos = new google.maps.LatLng(position.coords.latitude,
        //                                         position.coords.longitude);
        //        $scope.autocompleteFrom.setBounds(new google.maps.LatLngBounds(pos,
        //                    pos));

        //        var address = $scope.getAddressFromLatLang(position.coords.latitude, position.coords.longitude);
        //        var infowindow = new google.maps.InfoWindow({
        //            map: $scope.map,
        //            position: pos,
        //            content: 'Mikes Current Location'
        //        });

        //        var marker = new google.maps.Marker({
        //            position: pos,
        //            map: $scope.map,
        //            title: 'Uluru (Ayers Rock)'
        //        });
        //        google.maps.event.addListener(marker, 'click', function () {
        //            infowindow.open($scope.map, marker);
        //        });
        //        $scope.map.setCenter(pos);
        //    }, function () {
        //        $scope.handleNoGeolocation(true);
        //    });
        //} else {
        //    // Browser doesn't support Geolocation
        //    $scope.handleNoGeolocation(false);
        //}
    }
    // [START region_fillform]

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.fillInFromAddress = function () {
        // Get the place details from the autocomplete object.
        var place = $scope.autocompleteFrom.getPlace();

        var pos = new google.maps.LatLng(place.geometry.location.k,
                                            place.geometry.location.A);

        //$scope.autocompleteFrom.setBounds(new google.maps.LatLngBounds(pos,
        //            pos));

        var infowindow = new google.maps.InfoWindow({
            map: $scope.map,
            position: pos,
            content: $scope.driver + ' pickup address'
        });

        $scope.map.setCenter(pos);

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if ($scope.componentForm[addressType]) {
                var val = place.address_components[i][$scope.componentForm[addressType]];
                document.getElementById(addressType).value = val;
            }
        }

        var address_components = place.address_components;
        var components = {};
        jQuery.each(address_components, function (k, v1) { jQuery.each(v1.types, function (k2, v2) { components[v2] = v1.long_name }); })
        if ($scope.direction == "from") {
            $scope.mapfromaddress1 = components.route;
            $scope.mapfromaddressnumber = components.street_number;
            $scope.mapfromcity = components.locality;
            $scope.mapfromstate = components.administrative_area_level_1;
            $scope.mapfromzip = components.postal_code;
            $scope.mapfromcountry = "US";
            $scope.startAddress = $scope.mapfromaddressnumber + " " + $scope.mapfromaddress1 + " " + $scope.mapfromcity + " " + $scope.mapfromstate + ", " + $scope.mapfromzip;
        }
        if ($scope.direction == "to") {
            $scope.maptoaddress1 = components.route;
            $scope.maptoaddressnumber = components.street_number;
            $scope.maptocity = components.locality;
            $scope.maptostate = components.administrative_area_level_1;
            $scope.maptozip = components.postal_code;
            $scope.maptocountry = "US";
            $scope.endAddress = $scope.maptoaddressnumber + " " + $scope.maptoaddress1 + " " + $scope.maptocity + " " + $scope.maptostate + ", " + $scope.maptozip;
        }
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.fillInToAddress = function () {
        // Get the place details from the autocomplete object.
        var place = $scope.autocompleteTo.getPlace();

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if ($scope.componentForm[addressType]) {
                var val = place.address_components[i][$scope.componentForm[addressType]];
                document.getElementById(addressType + "1").value = val;
            }
        }

        var address_components = place.address_components;
        var components = {};
        jQuery.each(address_components, function (k, v1) { jQuery.each(v1.types, function (k2, v2) { components[v2] = v1.long_name }); })
        if ($scope.direction == "from") {
            $scope.mapfromaddress1 = components.route;
            $scope.mapfromaddressnumber = components.street_number;
            $scope.mapfromcity = components.locality;
            $scope.mapfromstate = components.administrative_area_level_1;
            $scope.mapfromzip = components.postal_code;
            $scope.mapfromcountry = "US";
            $scope.startAddress = $scope.mapfromaddressnumber + " " + $scope.mapfromaddress1 + " " + $scope.mapfromcity + " " + $scope.mapfromstate + ", " + $scope.mapfromzip;
        }
        if ($scope.direction == "to") {
            $scope.maptoaddress1 = components.route;
            $scope.maptoaddressnumber = components.street_number;
            $scope.maptocity = components.locality;
            $scope.maptostate = components.administrative_area_level_1;
            $scope.maptozip = components.postal_code;
            $scope.maptocountry = "US";
            $scope.endAddress = $scope.maptoaddressnumber + " " + $scope.maptoaddress1 + " " + $scope.maptocity + " " + $scope.maptostate + ", " + $scope.maptozip;
        }
        $scope.calcRoute();
    }
    // [END region_fillform]

    //$scope.getAddressFromLatLang = function (lat, lng) {
    //    var geocoder = new google.maps.Geocoder();
    //    var latLng = new google.maps.LatLng(lat, lng);
    //    geocoder.geocode({ 'latLng': latLng }, function (results, status) {
    //        if (status == google.maps.GeocoderStatus.OK) {
    //            if (results[0]) {
    //                var address_components = results[0].address_components;
    //                var components = {};
    //                jQuery.each(address_components, function (k, v1) { jQuery.each(v1.types, function (k2, v2) { components[v2] = v1.long_name }); })

    //                $scope.mapfromaddress1 = components.route;
    //                $scope.mapfromaddressnumber = components.street_number;
    //                $scope.mapfromcity = components.locality;
    //                $scope.mapfromstate = components.administrative_area_level_1;
    //                $scope.mapfromzip = components.postal_code;
    //                $scope.mapfromcountry = "US";
    //                $scope.startAddress = $scope.mapfromaddressnumber + " " + $scope.mapfromaddress1 + " " + $scope.mapfromcity + " " + $scope.mapfromstate + ", " + $scope.mapfromzip;
    //            }
    //        } else {
    //           // document.getElementById('map-directions').value = "Geocode was not successful for the following reason: " + status;
    //        }
    //    });
    //}

    /// <summary>
    /// 
    /// </summary>
    /// <param name="type"></param>
    /// <returns></returns>
    $scope.calcRoute = function () {
        $scope.endAddress = $scope.maptoaddress1 + " " + $scope.maptocity + " " + $scope.maptostate;
        var request = {
            origin: $scope.startAddress,
            destination: $scope.endAddress,
            travelMode: google.maps.TravelMode.DRIVING
        };
        $scope.directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                $scope.directionsDisplay.setDirections(response);
            }
        });
    };

    //$scope.handleNoGeolocation = function (errorFlag) {
    //    if (errorFlag) {
    //        var content = 'Error: The Geolocation service failed.';
    //    } else {
    //        var content = 'Error: Your browser doesn\'t support geolocation.';
    //    }
    //    var options = {
    //        map: $scope.map,
    //        position: new google.maps.LatLng(60, 105),
    //        content: content
    //    };
    //    var infowindow = new google.maps.InfoWindow(options);
    //    $scope.map.setCenter(options.position);
    //}
}]);

/// <summary>
/// 
/// </summary>
/// <param name="type"></param>
/// <returns></returns>
taxiControllers.controller('TaxiDetailCtrl', ['$scope', '$routeParams', 'Taxi', function ($scope, $routeParams, Taxi) {
    $scope.taxi = Taxi.get({ taxiId: $routeParams.taxiId }, function (taxi) {
        $scope.mainImageUrl = taxi.images[0];
    });
    $scope.setImage = function (imageUrl) {
        $scope.mainImageUrl = imageUrl;
    }
}]);