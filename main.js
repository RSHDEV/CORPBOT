const {
    WAConnection,
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange
} = require('@adiwajshing/baileys')
const fs = require('fs')
const { banner, start, success } = require('./lib/functions')
const { color } = require('./lib/color')

require('./corp.js')
nocache('./corp.js', module => console.log(`${module} is now updated!`))

const starts = async (corp = new WAConnection()) => {
    corp.logger.level = 'warn'
    corp.version = [2, 2123, 8]
    corp.browserDescription = [ 'GIFTIABOT', 'Chrome', '3.0' ]
    console.log(banner.string)
    corp.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan bang'))
    })

    fs.existsSync('./session.json') && corp.loadAuthInfo('./session.json')
    corp.on('connecting', () => {
        start('2', 'Connecting...')
    })
    corp.on('open', () => {
        success('2', 'Connected')
    })
    await corp.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./session.json', JSON.stringify(corp.base64EncodedAuthInfo(), null, '\t'))

    corp.on('chat-update', async (message) => {
        require('./corp.js')(corp, message)
    })
}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

starts()
