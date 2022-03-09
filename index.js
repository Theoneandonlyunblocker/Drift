var url = require('url');
const request = require('request')
const https = require('https')
var express = require('express')
var app = express()
const rewriter = require('./lib/rewriter.js')
var content_type = require('./lib/contentType.js')
var config = require('./app.json')

app.set('view engine', 'hbs');

var proxyPath = config.proxy_path

function proxyLink(url,cururl){
  
  if (url.match(/^(#|about:|data:|blob:|mailto:|javascript:|{|\*)/) || url.startsWith(proxyPath) || url.startsWith(cururl + proxyPath)){
    return url;
  };

  if (url.startsWith(cururl + '/') && !url.startsWith(cururl + proxyPath)){
    url = '/' + url.split('/').splice(3).join('/')
  };

  if (url.startsWith('//')){
    url = 'http:' + url;
  }
  if (url.startsWith('/') && !url.startsWith(proxyPath)){
    url = config.proxy_url + url;
  }

  if (url.startsWith('https://') || url.startsWith('http://')){
    url = new URL(url)
  }
  else {
    url = new URL(config.proxy_url.split('/').slice(0, -1).join('/') + '/' + url);
  }
  proxified = proxyPath + '/' + (url.href.split('/').splice(0, 3).join('/')) + "/" + url.href.split('/').splice(3).join('/');
  return proxified
}

function getcookie(req) {
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

  return cookie['proxyUrl']
}

app.get(`/proxy/*`, function(req, res) {
  try {
    var proxyUrl = req.originalUrl.substr(7, req.originalUrl.length)
    
    proxyUrl = proxyUrl.replace("https:/", "")
    proxyUrl = proxyUrl.replace("http:/", "")

    proxyUrl = `https://${proxyUrl}`

    request(proxyUrl, function(error, response, body) {
      try {
      if (!(typeof response.caseless.get('Content-Type') === "undefined")) {
        var contentType = response.caseless.get('Content-Type')
      } else {
        var contentType = "text/css"
      }} catch {
        
      }var contentType = "text/css"
      
      if (!(typeof contentType === "undefined")) {
        res.set({ 'Content-Type': response.caseless.get('Content-Type') })
      } else {
        res.set({ "Content-Type": 'text/css' })
      }

      if (contentType.includes("image")) {
        request({
          url: url,
          encoding: null
        },
          (err, resp, buffer) => {
            res.set({ "Content-Type": contentType });

            res.send(Buffer.from(response.body));

          });
      } else {
        if (contentType.includes("text/html")) {
          res.send(rewriter.write(body, proxyUrl, response.caseless.get('Content-Type')));
        } else {
          res.send(body)
        }
      }
    });
  } catch {
    res.sendFile('500.html', { "root": __dirname + "/views" })
  }
});

app.post('/', function(req, res) {
  var proxyUrl = getcookie(req).toString()

  proxyUrl = proxyUrl.replace("https:/", "")
  proxyUrl = proxyUrl.replace("http:/", "")

  proxyUrl = `https://${proxyUrl}`


  request(proxyUrl, function(error, response, body) {

    console.log(response.caseless.get('Content-Type'))
    if (!(typeof response.caseless.get('Content-Type') === "undefined")) {
      var contentType = response.caseless.get('Content-Type')
    } else {
      var contentType = "text/css"
    }
    
    if (!(typeof contentType === "undefined")) {
      res.set({ 'Content-Type': response.caseless.get('Content-Type') })
    } else {
      res.set({ "Content-Type": 'text/css' })
    }

    if (contentType.includes("image")) {
      request({
        url: url,
        encoding: null
      },
        (err, resp, buffer) => {
          res.set({ "Content-Type": contentType });

          res.send(Buffer.from(response.body));

        });
    } else {
      if (contentType.includes("text/html")) {
        res.send(rewriter.write(body, proxyUrl, response.caseless.get('Content-Type')));
      } else {
        res.send(body)
      }
    }
  });
});


app.get('/', function(req, res) {
  res.sendFile("index.html", { "root": __dirname + "/views" })
})

app.get('/content/*', function(req, res) {
  let url = req.originalUrl.substr(9, req.originalUrl.length)
  res.sendFile('siteLib/' + url, {
    "root": __dirname
  })
})

app.get('/*', function(req, res) {
  res.sendFile("404.html", { "root": __dirname + "/views" })
})

app.listen(5000, function() {
  console.log("Drift is running!")
})