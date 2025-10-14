const { EventEmitter } = require('events');

const stockUpdateEmitter = new EventEmitter();

// Allow unlimited listeners; admin dashboards may open multiple tabs
stockUpdateEmitter.setMaxListeners(0);

module.exports = stockUpdateEmitter;
