/* global modulejs */
'use strict';

(function() {
  // The only one event we can't handle by the app.
  window.addEventListener('load', function() {
    var Launcher = modulejs.require('Launcher');
    (new Launcher()).start();
  });
})();

