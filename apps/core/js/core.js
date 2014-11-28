/* global modulejs */
'use strict';

/**
 * Core state is the bootstraping state.
 * It would launch Launcher as the first launched app,
 * and listen to app changing events to change the app.
 *
 * The agent is for forwarding events from app to app.
 * Each special agent would know how and which events should
 * be forwarding. Agent is always for Core, which is the
 * center of messaging passing and mediator of the whole system.
 */
modulejs.define('Core', ['Process', 'Stream', 'SettingsCache',
    'LauncherAgent', 'Application', 'Sidebar'],
function (Process, Stream, SettingsCache, LauncherAgent,
  Application, Sidebar) {

  var Core = function() {
    this.configs = {
      listens: {
        events: [ 'load' ]
      }
    };
    this.elements = {
      view: null,
      app: null,
      sidebar: null
    };
    this.components = {
      app: null,
      sidebar: null
    };
    // Launcher launch other apps, including FTU if it's necessary.
    // In FTU mode, launcher is a transparent app and the only thing
    // it does is quickly transferring to FTU app.
    this.states = {
      launcheragent: null,
      launcherurl: null
    };
    this.process = new Process();
    this.stream = new Stream();
    this.settings = new SettingsCache();
    this.handleEvent = this.handleEvent.bind(this);
  };

  Core.prototype.start = function() {
    this.stream
      .start(this.process)
      .events(this.configs.listens.events)
      .handler(this.handleEvent);
    this.process
      .start()
      .then(this.fetchSettings.bind(this))
      .then(this.setupAgent.bind(this))
      .then(this.stream.ready.bind(this.stream))
      .catch(console.error.bind(console));
    return this.process;
  };

  Core.prototype.fetchSettings = function() {
    // XXX: When we get rid of Gaia, rename all things.
    return this.settings.get('homescreen.manifestURL')
      .then((url) => {
        this.states.launcherurl = url;
      });
  };

  Core.prototype.setupAgent = function() {
    this.states.launcheragent = new LauncherAgent();
    return this.states.launcheragent.start();
  };

  /**
   * We don't need to stop it. We destroy it.
   */
  Core.prototype.destroy = function() {
    this.process
      .destroy()
      .then(this.states.launcheragent.stop
          .bind(this.states.launcheragent))
      .then(this.stream.stop.bind(this.stream))
      .then(this.destroyComponents)
      .catch(console.error.bind(console));
    return this.process;
  };

  Core.prototype.handleEvent = function(evt) {
    switch (evt.type) {
      case 'load':
        // Since in bootstraping, the first app must be launched
        // after the event.
        this.startComponents();
        break;
    }
  };

  Core.prototype.startComponents = function() {
    var appstates = {
      manifesturl: this.states.launcherurl
    };
    this.components.app = new Application();
    this.components.sidebar = new Sidebar();
    return Promise.all([
      this.components.app.start(this.elements.app, appstates),
      this.components.sidebar.start(this.elements.sidebar)
    ]);
  };

  Core.prototype.destroyComponents = function() {
    return Promise.all([
      this.components.app.destroy(),
      this.components.sidebar.destroy()
    ]);
  };

  Core.prototype.setupView = function() {
    this.elements.view = document.body;
    this.elements.app = document.app;
    this.elements.sidebar = document.sidebar;
    Object.keys(this.elements).forEach((name) => {
      if (!this.elements[name]) {
        throw new Error(`Not a vaild element: ${name}`);
      }
    });
  };
  return Core;
});
