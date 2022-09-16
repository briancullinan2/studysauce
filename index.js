const fs = require('fs')
const path = require('path')
const express = require('express')
const { SAVE_URL, NON_ALPHA_NUM } = require('./docs/sauce.js')
const INDEX = fs.readFileSync('./index.html').toString('utf-8')

// todo: make dynamic
const STATIC_DECKS = [{
  name: 'Hebrew',
}, {
  name: 'Arabic',
}, {
  name: 'Real-estate',
}, {
  name: 'US Bill-of-rights',
}, {
  name: 'US Presidents',
}]

function listDecks() {
  return '<ol class="decks">' + STATIC_DECKS.map(deck => {
    return '<li><a href="' + deck.name.replace(NON_ALPHA_NUM, '-') + '.html">' + deck.name + '</a></li>'
  }).join('\n') + '</ol>'
}

function renderIndex() {
	let index = INDEX

	let bodyTag = index.match(/<ol class="decks"[\n\r.^>]*?>/i)
	let offset = bodyTag.index
	index = index.substring(0, offset)
		+ listDecks() + index.substring(offset + bodyTag[0].length, index.length)

	fs.writeFileSync(path.join(__dirname, 'docs/index.html'), index)
}

function randomKey(length = 8) {
  return Math.random().toString(16).substr(2, length);
}

const RECENT_UPLOADS = {}

function uploadFile(req, res, next) {
  // TODO: accept file uploads as minimal example, this took long because the machine is working against me
  let fileKey
  if(req.body.part == 0) {
    fileKey = randomKey(16)
    RECENT_UPLOADS[fileKey] = req.body.name
  } else {
    fileKey = req.body.key
  }

  // i'd feel bad about looking this stuff up if there wasn't so much nuance everywhere else, is this a sign that programmers are progressively worse the longer they use a specific technology?
  fs.writeFileSync(RECENT_UPLOADS[fileKey], Buffer.from(req.body.data), { flag: 'a' })

  if(req.body.part == 0) {
    res.setHeader('content-type', 'text/plain')
    return res.send(fileKey)
  } else {
    res.setHeader('content-type', 'text/plain')
    return res.send('Ok')
  }

  return next()
}

function loadContent(req, res, next) {
  let pathname = req.originalUrl
  if(pathname == '/') {
    pathname = '/index.html'
  }
  const filename = path.join(__dirname, '/docs/', req.originalUrl)
  if(pathname == '/index.html' && !fs.existsSync(filename)) {
    renderIndex()
  }
  if(fs.existsSync(filename)) {
    return res.sendFile(filename)
  }
  return next()
}

// TODO: PUT 405 error from NPM's `live-server`, no workaround listed, too complicated, not worth fighting about or fixing, good for simply static pages, not good for developing a server-side function


function startServer() {
  const app = express()
  app.enable('etag')
  app.set('etag', 'weak')
  app.use(express.json())
  app.use(loadContent)
  app.put(SAVE_URL, uploadFile)

  // TODO: nuance, none of these options work anymore, everything is broken, npm is infected or too much complexity to keep track of? why do so many tutorials have bad instructions? I must be living in some alternate reality of hell, https://stackoverflow.com/questions/10867052/cannot-serve-static-files-with-express-routing-and-no-trailing-slash
  
  //app.use(express.static(path.resolve(__dirname, './docs/')))
  //app.all('*', function(req, res) { res.redirect('/main/'); });
  //app.use('/', express.static(__dirname+'/docs'));

  const { createServer } = require('http')
  const httpServer = createServer(app).listen(8080)
  
}

module.exports = {
  startServer
}
