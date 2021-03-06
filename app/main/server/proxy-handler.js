'use strict';

const shell = require('electron').shell;
const rpc = require('./rpc-server');
const toast = require('./toast');
const clientLogger = require('./client-logger');

const proxyHandlers = {};

let app = null;

function initialize(_app) {
  app = _app;
}

function handle(service, func, args) {
  const handler = proxyHandlers[service];
  const _func = handler[func];
  _func(args);
}

proxyHandlers.app = {
  restart: () => app.restart(),
  quit: () => app.quit(),
  open: (query) => app.open(query),
  close: (dontRestoreFocus) => app.close(dontRestoreFocus),
  setQuery: (query) => rpc.send('mainwindow', 'set-query', query),
  openPreferences: (prefId) => app.openPreferences(prefId),
  reloadPlugins: () => app.reloadPlugins()
};

proxyHandlers.toast = {
  enqueue: (args) => {
    const { message, duration } = args;
    toast.enqueue(message, duration);
  }
};

proxyHandlers.shell = {
  showItemInFolder: (fullPath) => shell.showItemInFolder(fullPath),
  openItem: (fullPath) => shell.openItem(fullPath),
  openExternal: (fullPath) => shell.openExternal(fullPath)
};

proxyHandlers.logger = {
  log: (msg) => clientLogger.log(msg)
};

module.exports = { initialize, handle };
