/* global modulejs */
'use strict';

/**
 * Would push the app iframe to backstage, which is hidden.
 **/
modulejs.define('ApplicationHide', ['Process', 'Stream',
    'ApplicationKill', 'Application'],
function(Process, Stream, ApplicationKill, Application) {
  var ApplicationHide = function() {
    this.configs = {
      listens: {
        events: [ 'core.appshow', 'core.appkill' ]
      }
    };
    this.states = {};
    this.elements = {};
    this.process = new Process();
    this.stream = new Stream();
    this.handleEvent = this.handleEvent.bind(this);
  };

  ApplicationHide.prototype.start = function(view, states) {
    this.setView(view);
    this.setStates(states);
    this.stream
      .start(this.process)
      .events(this.configs.listens.events)
      .handler(this.handleEvent);
    this.process
      .start()
      .then(this.stream.ready.bind(this.stream))
      .then(this.hide.bind(this))
      .catch(console.error.bind(console));
    return this.process;
  };

  ApplicationHide.prototype.stop = function() {
    this.process
      .stop()
      .then(this.stream.stop.bind(this.stream))
      .catch(console.error.bind(console));
    return this.process;
  };

  ApplicationHide.prototype.destroy = function() {
    this.process
      .destroy()
      .catch(console.error.bind(console));
    return this.process;
  };

  ApplicationHide.prototype.handleEvent = function(evt) {
    if (evt.details.manifesturl !== this.states.manifesturl) {
      return;
    }
    switch (evt.type) {
      case 'core.appshow':
        this.stop().then(this.transferToShowState.bind(this));
        break;
      case 'core.appkill':
        this.stop().then(this.transferToKillState.bind(this));
        break;
    }
  };

  ApplicationHide.prototype.setView = function(view) {
    this.elements.view = view;
    this.elements.stage = view.getElementById('stage');
    this.elements.backstage = view.getElementById('backstage');
    Object.keys(this.elements).forEach((name) => {
      if (!this.elements[name]) {
        throw new Error(`Can't find the element: ${name}`);
      }
    });
  };

  ApplicationHide.prototype.setStates = function(states = {}) {
    this.states = states;
  };

  ApplicationHide.prototype.transferToKillState = function() {
    this.states.next = new ApplicationKill();
    return this.states.next.start(this.elements.view, this.states)
      .then(this.destroy.bind(this));
  };

  ApplicationHide.prototype.transferToShowState = function() {
    this.states.next = new Application();
    return this.states.next.start(this.elements.view, this.states)
      .then(this.destroy.bind(this));
  };

  ApplicationHide.prototype.hide = function() {
    this.elements.backstage.appendChild(this.states.iframe);
  };
  return ApplicationHide;
});

