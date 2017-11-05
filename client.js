//
const IOTA = require('iota.lib.js')
const MAMClient = require('./node_modules/mam.client.js/src/index.js')
const level = require('level')

const PROVIDER = 'http://p103.iotaledger.net:14700'
const SECURITY = 2
const MAM_FETCH_TIMEOUT = 30 * 1000
const LEVEL_DB_PREFIX = 'mam_demo'
const LEVEL_DB_FILE = './mam-client-db'

const iota = new IOTA({provider: PROVIDER})

console.log("iota.version : "+iota.version);

// Initiate client, write state leveldb
function init (seed, security = SECURITY) {
  const db = level(LEVEL_DB_FILE)
  //console.log("db : "+JSON.stringify(db,null,2));
  const client = {
    db,
    subscriptions: [],
    listeners: []
  }
  //console.log("client : "+JSON.stringify(client,null,2));
  return db.get(_dbKey('state')).then(state => {
    client.state = JSON.parse(state)
    console.log("state is : "+JSON.stringify(state,null,2));
    return client
  }).catch(err => {
    if (err.notFound) {
      client.state = MAMClient.init(seed, security)
      return client
    } else {
      console.log(err.stack || err)
    }
  })
}

// Publishes a new MAM
async function publish (client, message) {
  console.log(JSON.stringify(client.state))
  const {state, payload, root} = MAMClient.create(client.state, iota.utils.toTrytes(message))
  client.state = state
  try {
    await client.db.put(_dbKey('state'), JSON.stringify(state))
    console.log('ROOT', root)
    return MAMClient.attach(payload, root)
  } catch (err) {
    throw new Error(err)
  }
}

// Subscribe, writes subscription in db
async function subscribe (client, root) {
  if (client.subscriptions.root) {
    return
  }
  await client.db.put(_dbKey('sub_' + root), JSON.stringify({root, nextRoot: null}))
  return client
}

// Removes a subscription from db
async function unsubscribe (client, root) {
  await client.db.del(_dbKey('sub_' + root))
  return client
}

// Listen to a registered subscription
async function listen (client, root, cb, timeout = MAM_FETCH_TIMEOUT) {
  if (client.listeners[root]) {
    return
  }
  const dbKey = _dbKey('sub_' + root)
  await client.db.get(dbKey).then(async subscription => {
    subscription = JSON.parse(subscription)
    const res = await MAMClient.fetch(subscription.root)
    if (res.messages && res.messages.length) {
      if (subscription.nextRoot !== res.nextRoot) {
        subscription.root = subscription.nextRoot
        subscription.nextRoot = res.nextRoot
      }
      try {
        await client.db.put(dbKey, JSON.stringify(subscription))
        client.subscriptions[root] = subscription
      } catch (err) {
        throw new Error(err)
      }
      res.messages.map(message => iota.utils.fromTrytes(message)).forEach(message => cb(message))
    }
    client.listeners[root] = setTimeout(() => listen(client, root, cb, timeout), timeout)
  })
}

// Stops listenning to a subscription
function stopListening (client, root) {
  if (client.subscriptions.hasOwnProperty(root)) {
    clearTimeout(client.subscriptions[root]._timeout)
    client.listeners[root] = null
  }
}

// Just a debugging helper
function getStateFromDb (db) {
  db.get(_dbKey('state')).then(state => JSON.parse(state))
  return JSON.parse()   //probably return state here
}

// Prefix level db key
function _dbKey (key) {
  return LEVEL_DB_PREFIX + '_' + key
}

module.exports = {
  init,
  create: MAMClient.create,
  subscribe,
  unsubscribe,
  listen,
  stopListening,
  fetch: MAMClient.fetch,
  publish,
  getStateFromDb
}
