#!/usr/bin/env node

'use strict';
var argv = require('minimist')(process.argv.slice(2));
var ytorrent = require('./');
var bytes = require('pretty-bytes');
var blessed = require('blessed');
var contrib = require('blessed-contrib');
var prettySeconds = require('pretty-seconds')

var src = argv.s;

var engine = ytorrent(src);

engine.on('ready', function() {
  var fileCount = engine.files.length;
  console.log("files are " + fileCount);

  var timeStart = (new Date()).getTime()

  var screen = blessed.screen();
  var gauge = contrib.gauge({
    label: 'Progress'
  });
  screen.append(gauge);

  var status = function() {
    /*    var down = bytes(engine.swarm.downloaded)
    var downSpeed = bytes(engine.swarm.downloadSpeed()) + '/s'
    var up = bytes(engine.swarm.uploaded)
    var upSpeed = bytes(engine.swarm.uploadSpeed()) + '/s'
    var torrentSize = engine.torrent.length
    var bytesRemaining = torrentSize - engine.swarm.downloaded*/
    var percentage = ((engine.swarm.downloaded / engine.torrent.length) * 100).toPrecision(4)
      /*    var progressBar = ''
    var bars = ~~ ((percentage) / 5)*/

    // (TimeTaken / bytesDownloaded) * bytesLeft=timeLeft
    /*    if (engine.swarm.downloaded > 0) {
      if (engine.swarm.downloadSpeed() > 0) {
        var seconds = 1000;
        var timeNow = (new Date()).getTime()
        var timeElapsed = timeNow - timeStart
        var timeRemaining = (((timeElapsed / engine.swarm.downloaded) * bytesRemaining) / seconds).toPrecision(6)
        timeRemaining = 'Estimated ' + prettySeconds(~~timeRemaining) + ' remaining'
      } else {
        timeRemaining = 'Unknown time remaining'
      }
    } else {
      timeRemaining = "Calculating"
    }*/

    if (percentage > 100) {
      percentage = 100
    }

    /*    for (var i = 0; i < bars; i++) {
      progressBar = progressBar + '='
    }

    progressBar = progressBar + Array(20 + 1 - progressBar.length).join(' ');*/

    gauge.setPercent(parseInt(percentage, 10));
    screen.render();

    /*console.log(
      'Connected to ' + engine.swarm.wires.reduce(notChoked, 0) + '/' + engine.swarm.wires.length + ' peers\n' +
      'Downloaded ' + down + ' (' + downSpeed + ')\n' +
      'Uploaded ' + up + ' (' + upSpeed + ')\n' +
      'Torrent Size ' + bytes(torrentSize) + '\n\n' +
      'Complete: ' + percentage + '%\n' +
      '[' + progressBar + ']\n' +
      '0%    25   50   75   100%\n\n' + timeRemaining + '\n'
    )*/
  }

  var interval = setInterval(status, 100)
  status()
})

function notChoked(result, wire) {
  return result + (wire.peerChoking ? 0 : 1)
}

console.log(src);
