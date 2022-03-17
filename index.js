var url = require('url');
const request = require('request')
var fs = require('fs')
var express = require('express')
var app = express()
var device = require('express-device');
var hbs = require('hbs')
const rewriter = require('./lib/rewriter.js')
var config = require('./app.json')

app.use(device.capture());
app.set('view engine', 'hbs');

const blockedSites = config.blacklist
var proxyPath = config.prefix
const port = process.env.PORT || config.port

function proxy(req, res, proxyUrl) {
  request(proxyUrl, function(error, response, body) {

    if (error) {
      res.send(error)
    } else {

      if (!(typeof response.caseless.get('Content-Type') === "undefined")) {
        var contentType = response.caseless.get('Content-Type')
      } else {
        var contentType = "text/css"
      }

      if (!(typeof contentType === "undefined")) {
        res.set({
          'Content-Type': response.caseless.get('Content-Type')
        })
      } else {
        res.set({
          "Content-Type": 'text/css'
        })
      }

      if (contentType.includes("image")) {
        request({
          url: url,
          encoding: null
        },
          (err, resp, buffer) => {
            res.set({
              "Content-Type": contentType
            });

            res.send(Buffer.from(response.body));

          });
      } else {
        res.send(rewriter.write(body, proxyUrl, response.caseless.get('Content-Type')));
      }
    }
  })
}

function getcookie(req, name) {
  const parseCookie = str =>
    str
      .split(';')
      .map(v => v.split('='))
      .reduce((acc, v) => {
        acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());

        return acc;
      }, {});

  var cookie = req.headers.cookie;
  cookie.toString()

  cookie = parseCookie(cookie)

  return cookie[name]
}

function isPreset(url) {
  var xCurl = url.replace('https://', '')

}

app.get(`${proxyPath}/*`, function(req, res) {
  res.cookie('proxypath', proxyPath)
  
  try {

    var proxyUrl = req.originalUrl.substr(proxyPath.length + 1, req.originalUrl.length)

    proxyUrl = proxyUrl.replace("https:/", "")
    proxyUrl = proxyUrl.replace("http:/", "")

    proxyUrl = `https://${proxyUrl}`

    if (!(blockedSites.includes(proxyUrl))) {
      const options = {
        url: proxyUrl,
        headers: 'user-agent: Mozilla Firefox Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0',
        method: 'GET'
      };
      request(options, function(error, response, body) {
        if (error) {
          res.send(error.toString())
        } else {

          if (!(typeof response.caseless.get('Content-Type') === "undefined")) {
            var contentType = response.caseless.get('Content-Type')
          } else {
            var contentType = "text/css"
          }


          if (!(typeof contentType === "undefined")) {
            res.set({
              'Content-Type': response.caseless.get('Content-Type')
            })
          } else {
            res.set({
              "Content-Type": 'text/css'
            })
          }

          if (contentType.includes("image")) {
            request({
              url: url,
              encoding: null
            },
              (err, respond, buffer) => {
                res.setHeader('Content-Type', contentType)
                res.send(Buffer.from(response.body))
              });
          } else {
            if (contentType.includes("html")) {
              res.send(rewriter.write(body, proxyUrl, response.caseless.get('Content-Type')));
            } else {
              res.send(rewriter.write(body, proxyUrl, response.caseless.get('Content-Type')))
            }
          }
        }
      });
    } else {
      res.render('blocked', {
        site: proxyUrl
      })
    }
  } catch (e) {
    console.log(e)
    res.render('500', { err: e })
  }
});

app.post('/', function(req, res) {
  var proxyUrl = getcookie(req, 'proxyUrl').toString()
  res.cookie('proxypath', proxyPath)
  var dev = getcookie(req, 'dev')
  proxyUrl = proxyUrl.replace("https:/", "")
  proxyUrl = proxyUrl.replace("http:/", "")

  proxyUrl = `https://${proxyUrl}`
  try {

    if (!(blockedSites.includes(proxyUrl))) {
      request(proxyUrl, function(error, response, body) {

        if (error) {
          res.send(error)
        } else {

          if (!(typeof response.caseless.get('Content-Type') === "undefined")) {
            var contentType = response.caseless.get('Content-Type')
          } else {
            var contentType = "text/css"
          }

          if (!(typeof contentType === "undefined")) {
            res.set({
              'Content-Type': response.caseless.get('Content-Type')
            })
          } else {
            res.set({
              "Content-Type": 'text/css'
            })
          }

          if (contentType.includes("image")) {
            request({
              url: url,
              encoding: null
            },
              (err, resp, buffer) => {
                res.set({
                  "Content-Type": contentType
                });

                res.send(Buffer.from(response.body));

              });
          } else {
            res.send(rewriter.write(body, proxyUrl, response.caseless.get('Content-Type')||undefined));
          }
        }
      })
    } else {
      res.render('blocked', {
        site: proxyUrl
      })
    }
  } catch (e) {
    res.render('500', { err: e })
  }
});

app.get('/', function(req, res) {
  var devType = req.device.type
  if (devType === "desktop") {
    res.sendFile("index.html", {
      "root": __dirname + "/views"
    })
  } else {
    res.sendFile("mobile.html", {
      "root": __dirname + "/views"
    })
  }
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

app.get('/*', function(req, res) {
  res.sendFile("404.html", {
    "root": __dirname + "/views"
  })
})

app.listen(port, '0.0.0.0', function() {
  console.log(`Drift is running on 0.0.0.0:${port}`)
})