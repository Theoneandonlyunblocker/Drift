var cheerio = require('cheerio')
var validUrl = require('valid-url')

function write(doc,url) {
  const $ = cheerio.load(doc)
  $("*").each(function(){
    var href = $(this).attr("href")
    var src = $(this).attr("src")
    var action = $(this).attr("action")
    
    if (!(typeof href === 'undefined')){
      if (validUrl.isUri(href)){
        var href = `https://TermX-Proxy.jimmynuetron.repl.co/proxy/${href}`
      } else {
        if (href.indexOf('/')===1){
          var href = `https://TermX-Proxy.jimmynuetron.repl.co/proxy${url}${href}`
        } else {
          var href = `https://TermX-Proxy.jimmynuetron.repl.co/proxy/${url}/${href}`
        }
      }
      $(this).attr("href",href)
    }
  
    if (!(typeof src === 'undefined')){
      if (validUrl.isUri(src)){
        var src = `https://TermX-Proxy.jimmynuetron.repl.co/proxy/${src}`
      } else {
        if (src.indexOf('/')===1){
          var src = `https://TermX-Proxy.jimmynuetron.repl.co/proxy/${url}${src}`
        } else {
          if (url.lastIndexOf('/')===url.length){
            var src = `https://TermX-Proxy.jimmynuetron.repl.co/proxy/${url}/${src}`
          } else {
            var src = `https://TermX-Proxy.jimmynuetron.repl.co/proxy/${url}${src}`
          }
        }
      }
      $(this).attr("src",src)
    }

    if (!(typeof action === 'undefined')){
      
      if (validUrl.isUri(action)){
        var action = `https://TermX-Proxy.jimmynuetron.repl.co/proxy/${action}`
      } else {
        if (action.indexOf('/')===1){
          var action = `https://TermX-Proxy.jimmynuetron.repl.co/proxy${url}${action}`
        } else {
          var action = `https://TermX-Proxy.jimmynuetron.repl.co/proxy/${url}/${action}`
        }
      }
      $(this).attr("action",action)
    }
  })
  return $.html();
}
  
module.exports = {  write };