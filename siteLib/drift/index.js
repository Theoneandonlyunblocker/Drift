const url = require('url');
const request = require('request')
const fs = require('fs');
const rewriter = require('./lib/rewriter.js')
var config = require('./app.json')
var fakeUserAgent = require('fake-useragent')

const port = process.env.PORT || config.port

String.prototype.replaceAt = function(index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }
  return this.substring(0, index) + replacement + this.substring(index + 1);
}

function server(req, res) {

  var proxyPath = '/main'

    result = ""
    cookie = ""

    var proxyUrl = req.originalUrl.substr(proxyPath.length + 1, req.originalUrl.length)

    proxyUrl = proxyUrl.toString().replace("https:/", "")
    proxyUrl = proxyUrl.toString().replace("http:/", "")

    proxyUrl = `https://${proxyUrl}`

    res.cookie('proxypath', proxyPath)
    res.cookie('proxyUrl', proxyUrl)

    function between(min, max) {
      return Math.floor(
        Math.random() * (max - min) + min
      )
    }

    var choice = between(1,2)
    if (choice = 1){
      var userAgent = "Mozilla/5.0 (X11; Linux x86_64; rv:7.0) Gecko/20101111 Firefox/85.02"
    } else {
      var userAgent = fakeUserAgent()
    }
    var headers = { "User-Agent": userAgent }

    request({ url: proxyUrl, headers: headers }, function(error, response, body) {
      if (error) {

      } else {
        //console.log(response.caseless.get('Content-Type'))
       var contentType = response.caseless.get('Content-Type') || "text/json"

        if (!(typeof contentType === "undefined")) {
          
          res.type(response.caseless.get('Content-Type'));

        } else {
          res.type('application/javascript')
        }

        if (contentType.includes("image")) {
          request({
            url: proxyUrl,
            headers: { "User-Agent": userAgent },
            encoding: null
          },
            (err, respond, buffer) => {
              if (err) {
                console.log(err)
                res.send(err)
              } else {
                res.send(Buffer.from(respond.body))
              }
            });
        }

        else {
          res.send(rewriter.write(body, proxyUrl, response.caseless.get('Content-Type')))
        }
      
    }
    })
}

function contentSrc(file) {
  var f = fs.readFileSync(`./node_modules/drift-npm/lib/${file}`)
  return f
}

module.exports = {
  server,
  contentSrc
}