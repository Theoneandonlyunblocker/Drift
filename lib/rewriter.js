var cheerio = require('cheerio')
var validUrl = require('valid-url')
var config = require(__dirname.replace('lib','')+'app.json')

function write(doc,cururl) {
  var url = cururl.replace("https://","")
  var url = cururl.replace("http://","")
  function validUrl(trUrl){
    var regexpression = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

        if (regexpression.test(trUrl)) {
            return true
        } else{
            return false
    }
  }
  
  const $ = cheerio.load(doc)
  $("*").each(function(){
    var href = $(this).attr("href")
    var src = $(this).attr("src")
    var action = $(this).attr("action")
    
    if (!(typeof href === 'undefined')){
    
      if (validUrl(href)){
        if (href.indexOf('/')===1){
          var href = `https://${config.proxy_url}/proxy${href}`
        } else {
          var href = `https://${config.proxy_url}/proxy/${href}`
        }
      } else {
        if (href.indexOf('/')===1){
          var href = `https://${config.proxy_url}/proxy${url}${href}`
        } else {
          var href = `https://${config.proxy_url}/proxy/${url}/${href}`
        }
      }
      $(this).attr("href",href)
    }
  
    if (!(typeof src === 'undefined')){
      src = src.replace(/<.*\>/, '' );
      
      $(this).attr("type","text/javascript")
      if (validUrl(src)){
        
        if (src.indexOf('/')===1){
          var src = `https://${config.proxy_url}/proxy${src}`
        } else {
          var src = `https://${config.proxy_url}/proxy/${src}`
        }
      } else {
        if (src.indexOf('/')===1){
          var src = `https://${config.proxy_url}/proxy/${url}${src}`
        } else {
          if (url.lastIndexOf('/')===url.length){
            var src = `https://${config.proxy_url}/proxy/${url}${src}`
          } else {
            var src = `https://${config.proxy_url}/proxy/${url}/${src}`
          }
        }
      }
      
      $(this).attr("src",src)
    }

    if (!(typeof action === 'undefined')){
      
      if (validUrl(action)){
        var action = `https://${config.proxy_url}/proxy/${action}`
      } else {
        if (action.indexOf('/')===1){
          var action = `https://${config.proxy_url}/proxy${url}${action}`
        } else {
          var action = `https://${config.proxy_url}/proxy/${url}/${action}`
        }
      }
      $(this).attr("action",action)
    }
  })
  return $.html();
}
  
module.exports = {  write };