const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var configFile = __dirname.replace('/lib', '/') + 'app.json'
var config = require(configFile)

function write(html, url) {
  const dom = new JSDOM(html, {
    url: url
  })
  
  var tags = dom.window.document.getElementsByTagName("*");
  for (var i=0, max=tags.length; i < max; i++) {
    var elm = tags[i]
    var src = elm.src
    var href = elm.href
    var action = elm.action

    if (!(typeof src === "undefined" || src === "")){
      if (src.startsWith('https://')){
        src = `${config.prefix}/${src}`
      } else {
        if (src.startsWith('/')){
          src = `${config.prefix}/${url}${src}`
        } else {
          src = `${config.prefix}/${url}/${src}`
        }
      }

      if (config.devmode){
        elm.src = src
      } else {
      elm.setAttribute('drift-src',src)
    }}

    if (!(typeof href === "undefined" || href === "")){
      if (href.startsWith('https://')){
        href = `${config.prefix}/${href}`
      } else {
        if (href.startsWith('/')){
          href = `${config.prefix}/${url}${href}`
        } else {
          href = `${config.prefix}/${url}/${href}`
        }
      }

      if (config.devmode){
        elm.href = href
      } else {
      elm.setAttribute('drift-href',href)
    }}

    if (!(typeof action === "undefined" || action === "")){
      if (action.startsWith('https://')){
        action = `${config.prefix}/${action}`
      } else {
        if (action.startsWith('/')){
          action = `${config.prefix}/${url}${action}`
        } else {
          action = `${config.prefix}/${url}/${action}`
        }
      }

      if (config.devmode){
        elm.action = action
      } else {
      elm.setAttribute('drift-action',action)
      }
    }
    
  }

  var onpage = dom.window.document.createElement('script')
  onpage.src = '/content/js/onpage.js'
  dom.window.document.body.appendChild(onpage)
  
  return dom.serialize()
}

module.exports = {
  write
}