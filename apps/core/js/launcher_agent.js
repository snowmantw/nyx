/* global modulejs */
'use strict';

modulejs.define('LauncherAgent', ['Process', 'Stream'],
function(Process, Stream) {
  var LauncherAgent = function() {};
  LauncherAgent.prototype.start = function() {
    return Promise.resolve();
  };
  LauncherAgent.prototype.stop = function() {
    return Promise.resolve();
  };
  LauncherAgent.prototype.destroy = function() {
    return Promise.resolve();
  };
  LauncherAgent.prototype.handleEvent = function() {};
  return LauncherAgent;
});

