/* global modulejs */
'use strict';

/**
 * The Application manage the creation and destroying of
 * the application iframe.
 *
 * Application state is actuall two states: creation and show.
 * So when it receive 'hide' and 'kill' event, it would transfer
 * to one of these states.
 */
modulejs.define('Application', ['Process', 'Stream',
    'ApplicationHide', 'ApplicationKill'],
function(Process, Stream, ApplicationHide, ApplicationKill) {
  var Application = function() {
    this.configs = {
      events: [
        'core.apphide',
        'core.appkill'
      ]
    };
    this.states = {
      manifesturl: null,
      manifest: null,
      iframe: null,
      agent: null,
      next: null  // the next state
    };
    this.elements = {
      view: null,
      stage: null,
      backstage: null
    };
    this.handleEvent = this.handleEvent.bind(this);
  };

  /**
   * manifesturl: MUST give the url of the manifest.
   * agent: an optional proxy to forward events from core to the app iframe,
   *        and forward the events from app iframe to core.
   */
  Application.prototype.start =
  function(view, states) {
    this.setView(view);
    this.stream
      .start(this.process)
      .events(this.configs.listens.events)
      .handler(this.handleEvent);
    this.process
      .start()
      .then(() => (this.states.agent) ? this.states.agent.start() : {})
      .then(this.stream.ready.bind(this.stream))
      .then(this.fetchManifest.bind(this))
      .then(this.launch.bind(this))
      .then(this.show.bind(this)) // Since we're a showing & launching state.
      .catch(console.error.bind(console));
    return this.process;
  };

  Application.prototype.stop = function() {
    this.process
      .stop()
      .then(this.stream.stop.bind(this.stream))
      .then(() => (this.states.agent) ? this.states.agent.stop() : {})
      .catch(console.error.bind(console));
    return this.process;
  };

  /**
   * The most simple launching settings.
   * Other special settings should come with special Application*,
   * which inherit or mix this one.
   *
   * Here only choose different configs according to manifest.
   * Those attributes beyond manifest, should extend the Application.
   */
  Application.prototype.launch = function(manifest) {
    // Maybe we're in 'show' stage so we don't need to
    // launch it twice.
    if (this.states.iframe) {
      return;
    }
    var iframe = document.createElement('iframe');
    iframe.setAttribute('mozbrowser', 'true');
    iframe.setAttribute('remote', true);
    iframe.setAttribute('mozapp', this.states.manifesturl);
    iframe.setAttribute('mozallowfullscreen', 'true');
    this.states.iframe = iframe;
  };

  Application.prototype.show = function() {
    // Stage: show it; backstage: hide them.
    // Must make sure append after move (hide) the previous one.
    this.elements.stage.appendChild(this.states.iframe);
  };

  Application.prototype.fetchManifest = function() {
    // Maybe we're in 'show' stage so we don't need to
    // fetch it twice.
    if (this.states.manifest) {
      return;
    }
    var resolve, reject;
    var promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    window.navigator.mozApps.mgmt.getAll()
      .then((list) => {
        var  result = list.filter((app) => {
          return app.manifestURL === this.states.manifesturl;
        });
        if (1 === result.length) {
          this.states.manifest = result[0];
          resolve(result[0]);
        } else {
          reject(new Error(`Can't find the app installed with 
            ${this.states.manifesturl}`));
        }
      });
    return promise;
  };

  Application.prototype.destroy = function() {
    this.process
      .destroy()
      .catch(console.error.bind(console));
    return this.process;
  };

  Application.prototype.setView = function(view) {
    this.elements.view = view;
    this.elements.stage = view.getElementById('stage');
    this.elements.backstage = view.getElementById('backstage');
    Object.keys(this.elements).forEach((name) => {
      if (!this.elements[name]) {
        throw new Error(`Can't find the element: ${name}`);
      }
    });
  };

  Application.prototype.transferToHideState = function() {
    this.states.next = new ApplicationHide();
    return this.states.next.start().then(this.destroy.bind(this));
  };

  Application.prototype.transferToKillState = function() {
    this.states.next = new ApplicationKill();
    return this.states.next.start().then(this.destroy.bind(this));
  };

  Application.prototype.handleEvent = function(evt) {
    switch (evt.type) {
      case 'core.apphide':
        this.stop().then(this.transferToHideState.bind(this));
        break;
      case 'core.appkill':
        this.stop().then(this.transferToKillState.bind(this));
        break;
    }
  };

  return Application;
});

