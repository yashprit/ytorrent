#!/usr/bin/env node

'use strict';
var argv = require('minimist')(process.argv.slice(2));
var ytorrent = require('./');

var src = argv.s;

ytorrent.dl(src);
