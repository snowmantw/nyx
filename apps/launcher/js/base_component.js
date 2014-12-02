 /*global modulejs*/
'use strict';

modulejs.define('BaseComponent', ['Process', 'Stream'],
function(Process, Stream) {
  var BaseComponent = function() {
    this.configs = {
      listens: {
        events: [],
        interrupts: []
      }
    };
    this.states = {
      next: null
    };
    this.elements = {};
    this.components = {};
    this.process = new Process();
    this.stream = new Stream();
    this.handleEvent = this.handleEvent.bind(this);
    this.handleInterrupt = this.handleInterrupt.bind(this);
  };

  BaseComponent.prototype.start =
  function(view = document.body, states = {}) {
    this.setView(view);
    this.setStates(states);
    this.stream
      .start(this.process)
      .events(this.configs.listens.events)
      .interrupts(this.configs.listens.interrupts);
    this.process
      .start()
      .then(this.stream.ready.bind(this.stream))
      .then(this.startComponents.bind(this))
      .catch(console.error.bind(console));
  };

  BaseComponent.prototype.stop = function() {
    this.process
      .stop()
      .then(this.stream.stop.bind(this.stream))
      .then(this.stopComponents.bind(this))
      .catch(console.error.bind(console));
  };

  BaseComponent.prototype.destroy = function() {
    this.process
      .destroy()
      .then(this.destroyComponents.bind(this))
      .catch(console.error.bind(console));
  };
  BaseComponent.prototype.handleEvent = function() {};
  BaseComponent.prototype.handleInterrupt = function() {};

  BaseComponent.prototype.setView = function(view) {
    this.view = view;
    Object.keys(this.elements).forEach((key) => {
      // Replace query to DOM.
      var query = this.elements[key];
      if ('string' === typeof query) {
        this.elements[key] = this.view.querySelector(query);
        if (null === this.elements[key]) {
          throw new Error(`Can't find element ${key} with ${query}`);
        }
      }
    });
  };

  BaseComponent.prototype.setStates = function(states) {
    this.states = states;
  };

  BaseComponent.prototype.startComponents = function() {
    return this.waitComponents('start', [this.view, this.states]);
  };

  BaseComponent.prototype.stopComponents = function() {
    return this.waitComponents('stop');
  };

  BaseComponent.prototype.destroyComponents = function() {
    return this.waitComponents('destroy');
  };

  BaseComponent.prototype.waitComponents = function(method, args) {
    var startPromises =
    Object.keys(this.components).reduce((steps, name) => {
      var instance = this.components[name];
      // If the entry of the component actually contains multiple subcomponents.
      // We need to apply the method to each one and concat all the result
      // promises with our main array of applies.
      if (Array.isArray(instance)) {
        var applies = instance.map((subcomponent) => {
          return subcomponent.apply(subcomponent, args);
        });
        return steps.concat(applies);
      } else {
        return steps.concat([instance[method].apply(instance, args)]);
      }
    });
    return Promise.all(startPromises);
  };

  BaseComponent.prototype.transferTo = function(moduleName) {
    var StateClass = modulejs.require(moduleName);
    this.states.next = new StateClass();
    return this.states.next.start(this.elements.view, this.states)
      .then(this.destroy.bind(this));
  };

  return BaseComponent;
});

