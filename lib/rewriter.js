const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var configFile = __dirname.replace('/lib', '/') + 'app.json'
var config = require(configFile)
var UglifyJS = require("uglify-js");

function write(html, url, content) {
  try {
    if (content.includes('html')) {
      const dom = new JSDOM(html, {
        url: url
      })

      var tags = dom.window.document.getElementsByTagName("*");
      for (var i = 0, max = tags.length; i < max; i++) {
        var elm = tags[i]
        var src = elm.src
        var href = elm.href
        var action = elm.action

        if (!(typeof src === "undefined" || src === "")) {
          if (src.startsWith('https://')) {
            src = `${config.prefix}/${src}`
          } else {
            if (src.startsWith('/')) {
              src = `${config.prefix}/${url}${src}`
            } else {
              src = `${config.prefix}/${url}/${src}`
            }
          }

          if (config.devmode === "false") {
            elm.src = src
          } else {
            elm.setAttribute('drift-src', src)
          }
        }

        if (!(typeof href === "undefined" || href === "")) {
          if (href.startsWith('https://')) {
            href = `${config.prefix}/${href}`
          } else {
            if (href.startsWith('/')) {
              href = `${config.prefix}/${url}${href}`
            } else {
              href = `${config.prefix}/${url}/${href}`
            }
          }

          if (config.devmode === "false") {
            elm.href = href
          } else {
            elm.setAttribute('drift-href', href)
          }
        }

        if (!(typeof action === "undefined" || action === "")) {
          if (action.startsWith('https://')) {
            action = `${config.prefix}/${action}`
          } else {
            if (action.startsWith('/')) {
              action = `${config.prefix}/${url}${action}`
            } else {
              action = `${config.prefix}/${url}/${action}`
            }
          }

          if (config.devmode === "false") {
            elm.action = action
          } else {
            elm.setAttribute('drift-action', action)
          }
        }

      }

      dom.window.document.head.innerHTML = '<script src="/content/js/onpage.js"></script>' + dom.window.document.head.innerHTML
      //
      return dom.serialize()
    }
    else {
      if (content.includes('javascript')) {
        var js = html.toString().replaceAll('location', 'sourceMap')
        
        var result = UglifyJS.minify(js)
        
        return result.code
        
      } else {
        return html
      }
    }
  } catch (e){
    console.log(e)
    return html
  }
}

module.exports = {
  write
}