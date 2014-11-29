/* global modulejs */
'use strict';

modulejs.define('Sidebar', ['Process', 'Stream'],
function(Process, Stream) {
  var Sidebar = function() {};
  Sidebar.prototype.start = function() {
    return Promise.resolve();
  };
  Sidebar.prototype.stop = function() {
    return Promise.resolve();
  };
  Sidebar.prototype.destroy = function() {
    return Promise.resolve();
  };
  Sidebar.prototype.handleEvent = function() {};
  return Sidebar;
});

