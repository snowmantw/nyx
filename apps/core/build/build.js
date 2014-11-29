// TODO: remove these stuff when we get rid of the old build system.
/* global require, exports */
'use strict';

var utils = require('utils');

var CoreAppBuilder = function(options) {
  this.options = options;
};
CoreAppBuilder.prototype.concatFiles = function() {
  var options = this.options;
  var stagePath = options.STAGE_APP_DIR;
  var targetFile = utils.getFile(stagePath, 'js', 'main.js');
  var contents = [
    'process.js',
    'stream.js',
    'settings_cache.js',
    'core.js',
    'launcher_agent.js',
    'application.js',
    'application_hide.js',
    'application_kill.js',
    'sidebar.js'
  ].map(function(name) {
    return utils.getFileContent(
      utils.getFile.apply(utils, [stagePath, 'js', name]));
  });
  var mainContent = contents.reduce(function(concated, content) {
    return concated + content;
  }, '');
  utils.writeContent(targetFile, mainContent);
  return this;
};

CoreAppBuilder.prototype.copyToStage = function(){
  utils.copyToStage(this.options);
  return this;
};

exports.execute = function(options) {
  (new CoreAppBuilder(options))
    .copyToStage()
    .concatFiles();
};
