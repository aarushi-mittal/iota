const MAMClient = require('./client.js')

const seed = 'NZCXGPCJTGPHOHG9GYDOSVTXWDVMY9INPPBKTXOAZANY9BCJLRNXGHSMUHMCZZEASQDBHNSRLJADYTAXG'
const security = 2

// example root:
const exampleRoot = 'FEGSNGNKAYXLGHRQZGZM9AVUHJFONMMUBBVGNMEWORFXVXXXWQIZMYFAIYLVM9BZSJNFAZJTXNJJ9QGTG'

async function sub () {
  const client = await MAMClient.init()
  await MAMClient.subscribe(client, exampleRoot)
  MAMClient.listen(client, exampleRoot, (messages) => {
    console.log(messages)
  })
}

sub()