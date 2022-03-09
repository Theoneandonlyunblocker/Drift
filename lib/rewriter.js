var cheerio = require('cheerio')
var validUrl = require('valid-url')
var config = require(__dirname.replace('lib', '') + 'app.json')

function validateUrl(trUrl) {
  var regexpression = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  if (regexpression.test(trUrl)) {
    return true
  } else {
    return false
  }
}
console.log(rewriteUrlLogic('discord.com/register','discord.com'))
function rewriteUrlLogic(url, p) {
  //console.log(`${url} == ${validateUrl(url)}`)
  if (validateUrl(url)) {
    console.log(`${url} Is Valid`)
    if (url.indexOf('/') === 1) {
      var outp = `/proxy${url}`
    } else {
      var outp = `/proxy/${url}`
    }
  } else {
    console.log(`${url} Is Invalid`)
    if (url.indexOf('/') === 0) {
      var outp = `/proxy/${p}${url}`
    } else {
      var outp = `/proxy/${p}/${url}`
    }
    console.log(`It is now ${outp}`)
  }
  return outp
}

function write(doc, cururl) {
  var url = cururl.replace("https://", "")
  var url = cururl.replace("http://", "")

  function validUrl(trUrl) {
    var regexpression = /^(?:(?:https?|ftp?|blob?|http?):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    if (regexpression.test(trUrl)) {
      return true
    } else {
      return false
    }
  }

  const $ = cheerio.load(doc)
  $("*").each(function() {
    var href = $(this).attr("href")
    var src = $(this).attr("src")
    var action = $(this).attr("action")

    if (!(typeof href === 'undefined')) {
      var href = rewriteUrlLogic(href,cururl)
      
      $(this).attr("drift-href",href)
    }

    if (!(typeof src === 'undefined')) {
      var src = rewriteUrlLogic(src,cururl)
      
      $(this).attr("drift-src", src)
      
    }

    if (!(typeof action === 'undefined')) {
      var action = rewriteUrlLogic(action,cururl)
      
      $(this).attr("drift-action", action)
      
    }
  })

  $('head').append('<script src="/content/js/onpage.js"></script>')

  var html = $.html()
  html = html.replace("location.href", cururl)
  return html;
}

module.exports = { write };