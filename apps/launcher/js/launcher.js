/* global modulejs */
'use strict';

/***/
modulejs.define('Launcher', ['BaseComponent', 'Cover', 'Menu'],
function(BaseComponent, Cover, Menu) {
  var Launcher = function() {
    this.configs = {
      listens: {
        events: [
          'launcher.menu.request-panel-switching'
        ]
      }
    };
    this.elements = {
      covers: '#covers',
      menu: '#menu'
    };
    BaseComponent.apply(this, arguments);
    this.components = {
      Menu: new Menu()
    };
  };

  Launcher.prototype = Object.create(BaseComponent.prototype);

  Launcher.prototype.start = function() {
    // Setup covers accroding to the app data.
    // So that part is a variant starting.
    BaseComponent.prototype
      .start.apply(this, arguments)
      .then(this.fetchApps.bind(this))
      .then(this.setupCovers.bind(this))
      .then(this.renderCovers.bind(this))
      .catch(console.error.bind(console));
  };

  Launcher.prototype.setupCovers = function(appData) {
    this.components.Covers = appData.map((data) => {
      return (new Cover(data));
    });
    return Promise.all(this.components.Covers.map((cover) => {
      var newView = document.createElement('li');
      return cover.start(newView);
    }));
  };

  /**
   * Fetch all installed apps for create covers.
   * It would resolver the promise with app data.
   * TODO: Should have better cache strategy.
   */
  Launcher.prototype.fetchApps = function() {
    var resolve, reject;
    var promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    window.navigator.mozApps.mgmt.getAll()
      .then(resolve, reject);
    return promise;
  };

  Launcher.prototype.renderCovers = function() {
    this.elements.covers.appendChild(
      this.components.covers.reduce((buff, cover) => {
        buff.appendChild(cover.elements.view);
      },
      document.createDocumentFragment())
    );
  };

  Launcher.prototype.handleEvent = function(evt) {
    var details = evt.details || {};
    if ('launcher.menu.request-panel-switching' === evt.type) {
      switch (details.panel) {
        // Show the app list according to the favoriting rate.
        case 'LauncherFavorite':
        // Show the app list according to the using frequency.
        case 'LauncherFrequency':
        // Somewhat like Gaia's 'card view'.
        case 'LauncherHistory':
          return BaseComponent.prototype.transferTo(details.panel);
      }
    }
  };

  return Launcher;
});

