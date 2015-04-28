#!/usr/bin/env node

'use strict';
var argv = require('minimist')(process.argv.slice(2)); 
var ytorrent = require('./');

console.log(argv);
