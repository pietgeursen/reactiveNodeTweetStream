let Twit = require('twit')
let config = require('config');
let Rx = require('rx');

let twit_config = config.get('twitter');

let T = new Twit(twit_config);

let stream = T.stream('statuses/filter', {track: 'lol'});


let tweets = Rx.Observable.fromEvent(stream, 'tweet');
let simpleTweet = tweets.map(tweet => {

	return {
		text: tweet.text,
		coordinates: tweet.coordinates,
		user: {
			location: tweet.user.location,
			followers_count: tweet.user.followers_count
		}
	}
})

let subscription = simpleTweet.subscribe(
    function (x) {
        console.log(x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });


// T.get('search/tweets', { q: 'banana since:2011-11-11', count: 100 }, function(err, data, response) {
//   console.log(data)
// })

