/* global modulejs */
'use strict';

/***/
modulejs.define('Launcher', ['BaseComponent'],
function(BaseComponent) {
  var Launcher = function() {
    BaseComponent.apply(this, arguments);
  };
  Launcher.prototype = Object.create(BaseComponent.prototype);
  return Launcher;
});

