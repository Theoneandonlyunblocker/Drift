const jsdom = require("jsdom");
const {
  JSDOM
} = jsdom;
var fs = require('fs')

var config = {
  "prefix": "/main"
}

String.prototype.replaceAt = function (index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }
  return this.substring(0, index) + replacement + this.substring(index + 1);
}

function rewriteUrlLogic(link, dlocation) {
  let rewritten
  if (link.startsWith("https://") || link.startsWith("http://") || link.startsWith("//")) {
      if (link.startsWith('//')) {
          rewritten = `${config.prefix}/` + 'https:' + link
      } else {
          if (link.endsWith('/')) {
              rewritten = `${config.prefix}/${link}`
          } else {
              rewritten = `${config.prefix}/${link}/`
          }
      }
  } else {
      if (link.startsWith('//')) {
          rewritten = `${config.prefix}/${link}`
      } else {
          if (link === "/") {
              rewritten = `${config.prefix}/${dlocation}`
          } else {
              if (dlocation.endsWith('/')) {
                  dlocation = dlocation.substring(0, dlocation.length - 1)
              }
              if (link.startsWith('/')) {
                  rewritten = `${config.prefix}/${dlocation}${link}`
              } else {
                  rewritten = `${config.prefix}/${dlocation}/${link}`
              }
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
            config.prefix.length + dlocation.length + 2, ''
          )
        }

      }
      return a.replace(a, (url || a))
    }).join(' '))
  }).join(',')
}

function write(html, url, content) {
  //console.log(content)
  if (content.includes('html')) {
    const dom = new JSDOM(html, {

    })

    var tags = dom.window.document.getElementsByTagName("*");
    for (var i = 0, max = tags.length; i < max; i++) {
      var elm = tags[i]
      var src = elm.src
      var srcset = elm.srcset
      var href = elm.href
      var action = elm.action
      var poster = elm.poster
      var elmClass = elm.getAttribute('class')
      var tagType = elm.nodeName.toLowerCase()

			if (tagType == 'script'){
				js = elm.innerText
				if (js){
					js = js.replace(/window.location/g, 'sourceMap')
	      	js = js.replace(/document.location/g, 'sourceMap')
	      	js = js.replace(/location.replace/g, 'redirectDrift')
	      	js = js.replace(/location/g, 'sourceMap')
					elm.innerText = js
				}
			}
			
      if (elmClass === "g-recaptcha") {
        elm.setAttribute('data-sitekey', '6LdCNqIeAAAAAGF6lgjXwiEoUr5O-suYEiaGju59')
      }

      if (elm.getAttribute('integrity')) {
        elm.removeAttribute('integrity')
      }

      if (!(typeof srcset === "undefined")) {
        srcset = RewriteSrcset(srcset, url)

        elm.srcset = srcset;
      }

      if (!(typeof src === "undefined" || src === "")) {
        src = rewriteUrlLogic(src, url)


        elm.setAttribute('src', src)
      }

      if (!(typeof href === "undefined" || href === "")) {
        href = rewriteUrlLogic(href, url)


        elm.setAttribute('href', href)
      }

      if (!(typeof action === "undefined" || action === "")) {
        action = rewriteUrlLogic(action, url)

        elm.setAttribute('action', action)
      }

      if (!(typeof poster === "undefined" || action === "")) {
        poster = rewriteUrlLogic(poster, url)


        elm.setAttribute('poster', poster)
      }

      elm.setAttribute('drift-checked', 1)
    }

    dom.window.document.head.innerHTML = `<script src='/content/drift/lib/onpage.js' drift-checked='1'></script>` + dom.window.document.head.innerHTML
		
    return dom.serialize()
  } else {
    if (content.includes('javascript')) {
      let js
      js = html.replace(/window.location/g, 'sourceMap')
      js = js.replace(/document.location/g, 'sourceMap')
      res = js.replace(/location.replace/g, 'redirectDrift')
      js = js.replace(/location/g, 'sourceMap')

      return js

    } else {
      return html
    }
  }
}

module.exports = {
  write
}