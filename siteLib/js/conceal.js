var fs = require('fs')

var config = {
	"Auth":"Hello",
	"Fake_Page_Dir": '/views/prevent.html'
}
var Auth = ""

function fakePage(req,res){
	var page = req.originalUrl
	
	if (page == '/'){
		page = 'index'
	}
	if (!fs.existsSync(config.Fake_Page_Dir + page + '.html')) {
    page = '404'
  }
	res.sendFile(config.Fake_Page_Dir + page + '.html')
}

function proxy(req,res,next){
	if (req.originalUrl === '/auth'){
		next()
	} else {
		if (req.originalUrl != '/pass') {
				var auth = req.cookies['Auth']
	
				if (auth){
					if (auth === config.Auth || auth === Auth){
						next()
					} else {
						fakePage(req,res)
					}
				} else {
					fakePage(req,res)
				}
			
		} else {
			res.send(Auth)
		}
	}
}

function hide(conf){
	if (conf['Auth'] === 'Module'){
		Auth = Math.random().toString(16).substr(2, 8)
	}
	config = conf
	console.log("Auth: " + Auth || config.Auth)
}

module.exports = {
	proxy,
	hide
}