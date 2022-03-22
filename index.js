var url = require('url');
var fs = require('fs')
var express = require('express')
var app = express()
var device = require('express-device');
var hbs = require('hbs')
const drift = require('drift-npm')

app.use(device.capture());
app.set('view engine', 'hbs');

const port = 8080

function getcookie(req, name) {
const parseCookie = str =>
   str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
	 
      return acc;
    }, {});
}

app.get('/', function(req, res) {

  res.sendFile("index.html", {
    "root": __dirname + "/views"
  })

})

app.get("/lesson/*",function(req,res){
  drift.server(req,res);
})

app.get("/drift/:file",function(req,res){
  console.log(req.params.file)
  drift.contentSrc(req.params.file)
})

app.get('/s', function(req, res) {
  var proxyUrl = getcookie(req, 'proxyUrl') || 'google.com'
  res.cookie('proxypath', '/lesson')

  proxyUrl = proxyUrl.replace("https://", "")
  proxyUrl = proxyUrl.replace("http://", "")

  proxyUrl = `https://${proxyUrl}`

  res.render('stealth', { proxyUrl: '/lesson/' + proxyUrl })
})

app.get('/content/*', function(req, res) {
  let url = req.originalUrl.substr(9, req.originalUrl.length)
  res.sendFile('siteLib/' + url, {
    "root": __dirname
  })
})

app.get('/games', function(req, res) {
  res.sendFile('games.html', {
    "root": __dirname + "/views"
  })
})
app.get('/game/:game', function(req, res) {
  var game = req.params.game
  res.sendFile(`./siteLib/games/${game.toLowerCase()}.html`, {
    "root": __dirname
  })
})

app.get('/bookmarks', function(req, res) {
  res.sendFile('bookmarklets.html', {
    "root": __dirname + "/views"
  })
})

app.get('/cloak', function(req, res) {
  res.sendFile('tabCloak.html', {
    "root": __dirname + "/views"
  })
})

app.get('/youcannotguessthis', function(req, res) {
  res.sendFile('bypass.html', {
    "root": __dirname + "/views"
  })
})

app.listen(port, '0.0.0.0', function() {
  console.log(`Drift is running on 0.0.0.0:${port}`)
})