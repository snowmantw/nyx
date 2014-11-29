/* global modulejs */
'use strict';

modulejs.define('HardwareButtons', ['Process', 'Stream'],
function(Process, Stream) {
  var HardwareButtons = function() {};
  HardwareButtons.prototype.start = function() {
    return Promise.resolve();
  };
  HardwareButtons.prototype.stop = function() {
    return Promise.resolve();
  };
  HardwareButtons.prototype.destroy = function() {
    return Promise.resolve();
  };
  HardwareButtons.prototype.handleEvent = function() {};
  return HardwareButtons;
});

