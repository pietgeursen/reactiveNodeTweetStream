'use strict';

var Twit = require('twit');
var config = require('config');
var Rx = require('rx');
var request = require('request');
var observableGeoCoder = require('./observableRequest.js');

var twit_config = config.get('twitter');
var T = new Twit(twit_config);

var stream = T.stream('statuses/filter', { track: 'lol' });

var tweets = Rx.Observable.fromEvent(stream, 'tweet');
var simpleTweets = tweets.map(function (tweet) {

	return {
		text: tweet.text,
		coordinates: tweet.coordinates,
		user: {
			location: tweet.user.location,
			followers_count: tweet.user.followers_count
		}
	};
});

var geoCodeTweet = function geoCodeTweet(tweet) {

	var source = observableGeoCoder.getObservableGeocodedAddresses(tweet.user.location);

	var results = source.map(function (args) {
		var body = JSON.parse(args[2]);
		return body.results;
	});

	var nonEmptyResults = results.filter(function (result) {
		return result.length > 0;
	});

	var coords = nonEmptyResults.map(function (result) {
		return result[0].geometry.location;
	});

	var locatedTweets = coords.map(function (coord) {
		tweet.coordinates = { coordinates: [coord.lat, coord.lng] };
		return tweet;
	});

	return locatedTweets;
};

var tweetsWithLocation = simpleTweets.filter(function (tweet) {
	return tweet.user.location;
});

var tweetsWithCoords = simpleTweets.filter(function (tweet) {
	return tweet.coordinates;
});

var geoLocatedTweets = tweetsWithLocation.flatMap(geoCodeTweet);

var allTweetsWithLocations = Rx.Observable.merge(geoLocatedTweets, tweetsWithCoords);

var subscription = allTweetsWithLocations.subscribe(function (x) {
	console.log(x);
}, function (err) {
	console.log('Error: ' + err);
}, function () {
	console.log('Completed');
});

// T.get('search/tweets', { q: 'banana since:2011-11-11', count: 100 }, function(err, data, response) {
//   console.log(data)
// })
