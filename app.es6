let Twit = require('twit')
let config = require('config');
let twit_config = config.get('twitter');

let T = new Twit(twit_config);
