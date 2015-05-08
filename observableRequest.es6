let Rx = require('rx');
let request = require('request')
let config = require('config');


let gm_config = config.get('gm');

exports.getObservableGeocodedAddresses = (address) => {

	let url = "https://maps.googleapis.com/maps/api/geocode/json";

	let responses = Rx.Observable.fromCallback(request.get);
	let source = responses({url: url, qs: {address: address, key:gm_config.key}})
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