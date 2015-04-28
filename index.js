'use strict';

var torrentStream = require("torrent-stream");

var torrentDl = function(src, opts) {
  var engine = torrentStream(src, opts);
  engine.on('ready', function() {
    engine.files.forEach(function(file) {
      file.select();
    });
  });
  return engine;
}

module.exports = torrentDl;
