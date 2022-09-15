const fs = require('fs')

const INDEX = fs.readFileSync('./index.html').toString('utf-8')
const NON_ALPHA_NUM = (/[^a-z0-9-_]/gi)
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



module.exports = {
	renderIndex
}

