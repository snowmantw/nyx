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
    'LauncherAgent', 'Application', 'Sidebar', 'HardwareButtons'],
function (Process, Stream, SettingsCache, LauncherAgent,
  Application, Sidebar, HardwareButtons) {

  var Core = function() {
    this.configs = {
      listens: {
        // Handle platform events & Launcher events, so this list would
        // be long. However, some platform events would be handled
        // by other components, so we can avoid monstrous component.
        events: [
          'launcher.applaunch'
        ]
      }
    };
    this.elements = {
      view: null,
      app: null,
      sidebar: null
    };
    this.components = {
      apps: [],
      sidebar: null,
      hardwardButtons: null
    };
    // Launcher launch other apps, including FTU if it's necessary.
    // In FTU mode, launcher is a transparent app and the only thing
    // it does is quickly transferring to FTU app.
    this.states = {
      launcherurl: null
    };
    this.process = new Process();
    this.stream = new Stream();
    this.settings = new SettingsCache();
    this.handleEvent = this.handleEvent.bind(this);
  };

  Core.prototype.start = function() {
    this.setView();
    this.stream
      .start(this.process)
      .events(this.configs.listens.events)
      .handler(this.handleEvent);
    this.process
      .start()
      .then(this.fetchSettings.bind(this))
      .then(this.stream.ready.bind(this.stream))
      .then(this.startComponents.bind(this))
      .catch(console.error.bind(console));
    return this.process;
  };

  Core.prototype.fetchSettings = function() {
    // XXX: When we get rid of Gaia, rename all things.
    return this.settings.get('homescreen.manifestURL')
      .then((result) => {
        this.states.launcherurl = result['homescreen.manifestURL'];
      });
  };

  /**
   * We don't need to stop it. We destroy it.
   */
  Core.prototype.destroy = function() {
    this.process
      .destroy()
      .then(this.stream.stop.bind(this.stream))
      .then(this.destroyComponents)
      .catch(console.error.bind(console));
    return this.process;
  };

  Core.prototype.handleEvent = function(evt) {
    switch (evt.type) {
      case 'launcher.applaunch':
        break;
    }
  };

  Core.prototype.startComponents = function() {
    // First app is the launcher.
    // And Launcher would fire some special events to Core,
    // so we need a special agent for it.
    var appstates = {
      manifesturl: this.states.launcherurl,
      agent: new LauncherAgent()
    };
    this.components.apps = [ new Application() ];
    this.components.sidebar = new Sidebar();
    this.components.hardwareButtons = new HardwareButtons();
    return Promise.all([
      this.components.apps[0].start(this.elements.app, appstates),
      this.components.sidebar.start(this.elements.sidebar),
      this.components.hardwareButtons.start()
    ]);
  };

  Core.prototype.destroyComponents = function() {
    var appDestroies = this.components.apps.map((app) => {
      return app.destroy();
    });
    return Promise.all(appDestroies.concat([
      this.components.sidebar.destroy(),
      this.components.hardwareButtons.destroy()
    ]));
  };

  Core.prototype.setView = function() {
    this.elements.view = document.body;
    this.elements.app = document.getElementById('app');
    this.elements.sidebar = document.getElementById('sidebar');
    Object.keys(this.elements).forEach((name) => {
      if (!this.elements[name]) {
        throw new Error(`Not a vaild element: ${name}`);
      }
    });
  };
  return Core;
});
