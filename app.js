'use strict';

var Twit = require('twit');
var config = require('config');
var twit_config = config.get('twitter');

var T = new Twit(twit_config);
