/* global modulejs */
'use strict';

/**
 * Would kill the app. This is the end state, and would listen nothing anymore.
 **/
modulejs.define('ApplicationKill', ['Process', 'Application'],
function(Process, Application) {
  var ApplicationKill = function() {
    this.configs = {};
    this.states = {};
    this.elements = {};
    this.process = new Process();
    this.handleEvent = this.handleEvent.bind(this);
  };

  ApplicationKill.prototype.start = function(view, states) {
    this.setView(view);
    this.setStates(states);
    this.process
      .start()
      .then(this.kill.bind(this))
      .catch(console.error.bind(console));
    return this.process;
  };

  ApplicationKill.prototype.stop = function() {
    this.process
      .stop()
      .catch(console.error.bind(console));
    return this.process;
  };

  ApplicationKill.prototype.destroy = function() {
    this.process
      .destroy()
      .catch(console.error.bind(console));
    return this.process;
  };

  ApplicationKill.prototype.setView = function(view) {
    this.elements.view = view;
    this.elements.stage = view.getElementById('stage');
    this.elements.backstage = view.getElementById('backstage');
    Object.keys(this.elements).forEach((name) => {
      if (!this.elements[name]) {
        throw new Error(`Can't find the element: ${name}`);
      }
    });
  };

  ApplicationKill.prototype.setStates = function(states = {}) {
    this.states = states;
  };

  ApplicationKill.prototype.kill = function() {
    // TODO
  };
  return ApplicationKill;
});

