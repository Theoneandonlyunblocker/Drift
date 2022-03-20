const jsdom = require("jsdom");
const { JSDOM } = jsdom;
var configFile = __dirname.replace('/lib', '/') + 'app.json'
var config = require(configFile)
var UglifyJS = require("uglify-js");

String.prototype.replaceAt = function(index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }
  return this.substring(0, index) + replacement + this.substring(index + 1);
}

function rewriteUrlLogic(link, dlocation) {
  let rewritten
  if (link.startsWith('https://')) {
    rewritten = `${config.prefix}/${link}`
  } else {
    if (link.startsWith('//')) {
      rewritten = `${config.prefix}/${link}`
    } else {
      if (link.startsWith('/')) {
        rewritten = `${config.prefix}/${dlocation}/${link}`

      } else {
        rewritten = `${config.prefix}/${dlocation}${link}`
      }
    }
  }
  return rewritten
}

function RewriteSrcset(sample, dlocation) {
  return sample.split(',').map(e => {
    return (e.split(' ').map(a => {
      if (a.startsWith('http') || (a.startsWith('/') && !a.startsWith(config.prefix))) {
        var url = rewriteUrlLogic(a, dlocation)
        if (url.startsWith('/')) {
          url = url.replaceAt(
            config.prefix.length + dlocation.length + 2
            , ''
          )
        }

      }
      return a.replace(a, (url || a))
    }).join(' '))
  }).join(',')
}

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
        var srcset = elm.srcset
        var href = elm.href
        var action = elm.action

        if (elm.getAttribute('integrity')) {
          elm.removeAttribute('integrity')
        }

        if (!(typeof srcset === "undefined")) {
          srcset = RewriteSrcset(srcset, url)

          elm.srcset = srcset;
        }

        if (!(typeof src === "undefined" || src === "")) {
          src = rewriteUrlLogic(src, url)

          if (config.devmode === "false") {
            elm.src = src
          } else {
            elm.setAttribute('drift-src', src)
          }
        }

        if (!(typeof href === "undefined" || href === "")) {
          href = rewriteUrlLogic(href, url)

          if (config.devmode === "false") {
            elm.href = href
          } else {
            elm.setAttribute('drift-href', href)
          }
        }

        if (!(typeof action === "undefined" || action === "")) {
          action = rewriteUrlLogic(action, url)

          if (config.devmode === "false") {
            elm.action = action
          } else {
            elm.setAttribute('drift-action', action)
          }
        }

      }

      dom.window.document.head.innerHTML = '<script src="/content/js/onpage.js"></script>' + dom.window.document.head.innerHTML
      let res
      res = dom.serialize().replace(/location./g, 'sourceMap.')
      res = dom.serialize().replace(/window.location./g, 'sourceMap.')
      
      return res
    }
    else {
      if (content.includes('javascript')) {
        let js
        js = html.replace(/window.location./g, 'sourceMap.')
        js = html.replace(/location./g, 'sourceMap.')
        
        return js

      } else {
        return html
      }
    }
  } catch (e) {
    console.log(e)
    return html
  }
}

module.exports = {
  write
}