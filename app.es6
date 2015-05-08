let Twit = require('twit')
let config = require('config');
let Rx = require('rx');
let request = require('request');
let observableGeoCoder = require('./observableRequest.js');


let twit_config = config.get('twitter')
let T = new Twit(twit_config);

let stream = T.stream('statuses/filter', {track: 'lol'});


let tweets = Rx.Observable.fromEvent(stream, 'tweet');
let simpleTweets = tweets.map(tweet => {

	return {
		text: tweet.text,
		coordinates: tweet.coordinates,
		user: {
			location: tweet.user.location,
			followers_count: tweet.user.followers_count
		}
	}
})

let geoCodeTweet = tweet => {

	let source = observableGeoCoder.getObservableGeocodedAddresses(tweet.user.location);


	let results = source.map((args) => {
		let body = JSON.parse(args[2])
		return body.results;
	})

	let nonEmptyResults = results.filter((result) => {
		return result.length > 0;
	})

	let coords = nonEmptyResults.map(result => {
		return result[0].geometry.location;
	})

	let locatedTweets = coords.map(coord => {
		tweet.coordinates = {coordinates: [coord.lat, coord.lng]};
		return tweet;
	})

	return locatedTweets;
}

let tweetsWithLocation = simpleTweets.filter((tweet) =>{
	return tweet.user.location;
})

let tweetsWithCoords = simpleTweets.filter((tweet) => {
	return tweet.coordinates;
})


let geoLocatedTweets = tweetsWithLocation.flatMap(geoCodeTweet);


let allTweetsWithLocations = Rx.Observable.merge(geoLocatedTweets, tweetsWithCoords)


let subscription = allTweetsWithLocations.subscribe(
    (x) => {
        console.log(x);
    },
    (err) => {
        console.log('Error: ' + err);
    },
    () => {
        console.log('Completed');
    });


// T.get('search/tweets', { q: 'banana since:2011-11-11', count: 100 }, function(err, data, response) {
//   console.log(data)
// })

