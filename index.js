var url = require('url');
var fs = require('fs')
var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
var device = require('express-device');
var hbs = require('hbs')
const drift = require('./siteLib/drift/index.js')
const experimental = require('./siteLib/drift/proxy.js')
const blocker = require('./siteLib/js/blocker.js')
var analytics = require('@enderkingj/analytics');
var comipleGames = require('./siteLib/js/gameCompiler.js')
const conceal = require('./siteLib/js/conceal.js')

const middleware = conceal.hide({
	"Auth":'Module',
	"Fake_Page_Dir": __dirname+'/views/fake/'
})

app.use((req, res, next) => {
  if (analytics(req, res)==false) return next();
  else {
    
  };
}) // there we go basic stuff set up

app.use(cookieParser());
app.use(conceal.proxy)
app.use(blocker.filter)
app.set('view engine', 'hbs');
//console.log(drift.contentSrc('onpage.js').toString())
const port = 8080

const getcookie = (req,cname) => {
  // We extract the raw cookies from the request headers
  const rawCookies = req.headers.cookie.split('; ');

  const parsedCookies = {};
  rawCookies.forEach(rawCookie => {
    const parsedCookie = rawCookie.split('=');
    
    parsedCookies[parsedCookie[0]] = parsedCookie[1];
  });

  return parsedCookies.proxyURL;
};

app.get('/', function(req, res) {
  res.sendFile("index.html", {
    "root": __dirname + "/views"
  })

})

app.get('/auth',function(req,res){
	res.sendFile(__dirname + '/views/auth.html')
})

app.get('/ab',function(req,res){
  res.sendFile("ab.html", {
    "root": __dirname + "/views"
  })
})

app.get('/main/*',function(req,res){
  experimental.server(req,res)
})

app.get('/s', function(req, res) {
  res.sendFile('stealth.html', {
    "root": __dirname+"/views"
  })
})

app.get('/content/*', function(req, res) {
  let url = req.originalUrl.substr(9, req.originalUrl.length)
  res.set('Service-Worker-Allowed','/main')
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