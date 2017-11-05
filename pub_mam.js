const MAMClient = require('./client.js')

const seed = 'NZCXGPCJTGPHOHG9GYDOSVTXWDVMY9INPPBKTXOAZANY9BCJLRNXGHSMUHMCZZEASQDBHNSRLJADYTAXG'
const security = 2

async function pub () {
  const client = await MAMClient.init(seed, security)
  const message = 'hello'
  const tx = await MAMClient.publish(client, message)
  console.log('Message sent! Transaction: ', tx[0].hash)
}

// example root:
const exampleRoot = 'FEGSNGNKAYXLGHRQZGZM9AVUHJFONMMUBBVGNMEWORFXVXXXWQIZMYFAIYLVM9BZSJNFAZJTXNJJ9QGTG'

pub() ;

