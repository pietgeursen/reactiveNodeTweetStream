'use strict';

var Twit = require('twit');
var config = require('config');
var Rx = require('rx');

var twit_config = config.get('twitter');

var T = new Twit(twit_config);

var stream = T.stream('statuses/filter', { track: 'lol' });

var tweets = Rx.Observable.fromEvent(stream, 'tweet');
var simpleTweet = tweets.map(function (tweet) {

    return {
        text: tweet.text,
        coordinates: tweet.coordinates,
        user: {
            location: tweet.user.location,
            followers_count: tweet.user.followers_count
        }
    };
});

var subscription = simpleTweet.subscribe(function (x) {
    console.log(x);
}, function (err) {
    console.log('Error: ' + err);
}, function () {
    console.log('Completed');
});

// T.get('search/tweets', { q: 'banana since:2011-11-11', count: 100 }, function(err, data, response) {
//   console.log(data)
// })
