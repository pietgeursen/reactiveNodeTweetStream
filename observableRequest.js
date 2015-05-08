'use strict';

var Rx = require('rx');
var request = require('request');
var config = require('config');

var gm_config = config.get('gm');

exports.getObservableGeocodedAddresses = function (address) {

	var url = 'https://maps.googleapis.com/maps/api/geocode/json';

	var responses = Rx.Observable.fromCallback(request.get);
	var source = responses({ url: url, qs: { address: address, key: gm_config.key } });
	return source;
}

// var subscription = source.subscribe(
//     function (x) {
//         console.log('Next: ' + x);
//     },
//     function (err) {
//         console.log('Error: ' + err);
//     },
//     function () {
//         console.log('Completed');
//     });
;
