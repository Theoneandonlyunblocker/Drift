const url = require('url');
const fs = require('fs');
const rewriter = require('./lib/rewriter.js')
var fakeUserAgent = require('fake-useragent')
const fetch = require('node-fetch');

var config = {
  "prefix": "/main"
}

const port = process.env.PORT || config.port

String.prototype.replaceAt = function (index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }
  return this.substring(0, index) + replacement + this.substring(index + 1);
}

async function server(req, res) {
  var proxyPath = config.prefix
  var path = req.originalUrl.substr(0, proxyPath.length)

  //console.log(path,proxyPath)
  
  if (path === proxyPath) {
    result = ""
    cookie = ""

    var proxyUrl = req.originalUrl.substr(proxyPath.length + 1, req.originalUrl.length)

    proxyUrl = proxyUrl.toString().replace("https:/", "")
    proxyUrl = proxyUrl.toString().replace("http:/", "")

    proxyUrl = `https://${proxyUrl}`

    //console.log(proxyUrl)
    
    res.cookie('proxypath', proxyPath)
    res.cookie('proxyUrl', proxyUrl)

    function between(min, max) {
      return Math.floor(
        Math.random() * (max - min) + min
      )
    }

    var choice = between(1, 2)
    if (choice = 1) {
      var userAgent = "Mozilla/5.0 (X11; Linux x86_64; rv:7.0) Gecko/20101111 Firefox/85.02"
    } else {
      var userAgent = fakeUserAgent()
    }
    var headers = {
      "User-Agent": userAgent
    }
    try {
      var response = await fetch(proxyUrl, {
        headers: headers
      })

      try {
        var contentType = response.headers.get('content-type')
      } catch {
        var contentType = "application/javascript"
      }

      res.type(contentType);
      var body = await response.text()
      
      if (contentType.includes("image") || contentType.includes("video")) {
        res.send(Buffer.from(body))
      } else {
        body = rewriter.write(body, proxyUrl, contentType)

        res.send(body)
      };
    } catch (e){
      res.send(`<h1>Error For ${proxyUrl}</h1><br><p>${e}</p>`)
      console.log(e)
      console.log(proxyUrl)
    }
  }

};

module.exports = {
  server
}