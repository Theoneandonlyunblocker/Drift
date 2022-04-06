var fs = require('fs')

function parseHtml() {
	var games = []
	var files = fs.readdirSync('./siteLib/games')
	files.forEach(function(file) {
		var name = file.split('.html')[0]
		games.push(name)
	})
	
	var gameTml = ""
	for (var i = 0; i < games.length; i++) {
		var game = games[i]
		
		gameTml = gameTml + `<div class="game"><a href='/game/${game}'><img src="/content/images/${game}.jpeg" width="100px" height="100px" style="text-align: center;"></img><br></br><a>${game}</a>
        </a>
      </div>`
	}
	
	var tml = fs.readFileSync('./views/games.html').toString()
	tml = tml.replace (/<!--Games-->/g, gameTml)
	
	fs.writeFileSync('./views/games.html', tml)
}

parseHtml()