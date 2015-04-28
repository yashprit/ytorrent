'use strict';

var torrentStream = require("torrent-stream");
var blessed = require('blessed');
var contrib = require('blessed-contrib');

exports.dl = function(src, opts) {
  var engine = torrentStream(src, opts);
  engine.on('ready', function() {

    var screen = blessed.screen();

    var grid = new contrib.grid({
      rows: 12,
      cols: 12,
      screen: screen
    });

    engine.files.forEach(function(file) {
      file.select();
    });

    var fileCount = engine.files.length;

    var label = 'Downloading ' + fileCount + (fileCount === 1 ? ' file' : ' files');

    var gauge = grid.set(0, 6, 6, 6, contrib.gauge, {
      label: label
    });

    var log = grid.set(0, 0, 6, 6, contrib.log, {
      fg: "green",
      selectedFg: "green",
      label: 'File Description'
    });

    var names = engine.files.map(function(f) {
      return f.name.trim();
    }).join('\n');

    log.log(names);

    var status = function() {
      var percentage = ((engine.swarm.downloaded / engine.torrent.length) * 100).toPrecision(4)

      if (percentage > 100) {
        percentage = 100
      }
      gauge.setPercent(parseInt(percentage, 10));
      screen.render();
    }

    var interval = setInterval(status, 100)
    status();
  });
}
