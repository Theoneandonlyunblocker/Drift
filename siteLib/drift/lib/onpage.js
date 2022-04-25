navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for (let registration of registrations) {
    registration.unregister()
  }
})

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`/content/drift/lib/service-worker.js`, {
      scope: '/main'
    })
      .then((registration) => {
        console.log('Service Worker registration completed with scope: ',
          registration.scope)
      }, (err) => {
        console.log('Service Worker registration failed', err)
      })
  })
} else {
  console.log('Service Workers not supported')
}

config = { "prefix": "/main" }

const updatedCheck = false

String.prototype.replaceAt = function(index, replacement) {
  if (index >= this.length) {
    return this.valueOf();
  }
  return this.substring(0, index) + replacement + this.substring(index + 1);
}

function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split('; ');
  let res;
  cArr.forEach(val => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  })
  return res
}

function RewriteSrcset(sample, dlocation) {
  return sample.split(',').map(e => {
    return (e.split(' ').map(a => {
      if (a.startsWith('http') || (a.startsWith('/') && !a.startsWith(getCookie('proxyPath')))) {
        var url = rewriteUrlLogic(a, dlocation)
        if (url.startsWith('/')) {
          url = url.replaceAt(
            getCookie('proxyPath') + dlocation.length + 2
            , ''
          )
        }

      }
      return a.replace(a, (url || a))
    }).join(' '))
  }).join(',')
}

function validUrl(trUrl) {
  var regexpression = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  if (regexpression.test(trUrl)) {
    return true
  } else {
    return false
  }
}

var proxyUrl = getCookie('proxyUrl')
if (proxyUrl.startsWith('https://') || proxyUrl.startsWith('http://')) {
  var formatedUrl = new URL(proxyUrl)
} else {
  var formatedUrl = new URL('https://' + proxyUrl)
}
var proxyPath = getCookie('proxypath')

sourceMap = formatedUrl
//Other stuff relating to location.***return Reflect.get(...arguments);
sourceMap.replace = redirectDrift

if (location.pathname === "/") {
  var dlocation = proxyUrl

} else {
  var dlocation = location.pathname.replace('/lesson/', '')
  console.log(location.pathname)
}

function redirectDrift(url) {
  location.href = rewriteUrlLogic(url)
	return ''
}

const loactionHandler = {
  get(target, prop, receiver) {
    return redirectDrift(sourceMap.href)
  }
};

const locationProxy = new Proxy(sourceMap, loactionHandler);

function rewriteUrlLogic(link) {
  let rewritten
  if (link.startsWith("https://") || link.startsWith("http://") || link.startsWith("//")) {
    if (link.startsWith('//')) {
      rewritten = `/main/` + 'https:' + link
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

function tabCloak() {
  var favicon = getCookie('faviconCloak')
  var titleCloal = getCookie('titleCloak')

  if (!(typeof favicon === "null")) {
    favChange(favicon)
  }

  if (!(typeof titleCloal === "null")) {
    document.title = titleCloal
  }
}

function favChange(link) {
  let $favicon = document.querySelector('link[rel="icon"]')

  if ($favicon !== null) {
    $favicon.href = link

  } else {
    $favicon = document.createElement("link")
    $favicon.rel = "icon"
    $favicon.href = link
    document.head.appendChild($favicon)
  }
}

var observeDOM = (function() {
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function(obj, callback) {
    if (!obj || obj.nodeType !== 1) return;

    if (MutationObserver) {

      var mutationObserver = new MutationObserver(callback)

      mutationObserver.observe(obj, {
        childList: true,
        subtree: true
      })
      return mutationObserver
    } else if (window.addEventListener) {
      obj.addEventListener('DOMNodeInserted', function() { callback; updatedCheck = true }, false)
      obj.addEventListener('DOMNodeRemoved', function() { callback; updatedCheck = true }, false)
    }
  }
})()

function update() {
  var DRIFTelements = document.querySelectorAll("*")
	
	for (let i = 0; i < DRIFTelements.length; i++) {
    var DRIFTelm = DRIFTelements[i]
    var checked = DRIFTelm.getAttribute('drift-checked')
    var href = DRIFTelm.getAttribute('href')
    var src = DRIFTelm.getAttribute('src')
    var action = DRIFTelm.getAttribute('action')
    var srcset = DRIFTelm.getAttribute('srcset')
    var poster = DRIFTelm.getAttribute('poster')

    DRIFTelm.onchange = "update()"

    if (checked == 0 || checked == null) {
      if (!(srcset === null)) {
        srcset = RewriteSrcset(srcset, proxyPath)

        DRIFTelm.setAttribute('srcset', srcset)
      }
      if (!(href === null)) {
        href = rewriteUrlLogic(href);

        DRIFTelm.setAttribute('href', href)
      }
      if (!(href === null)) {
        href = rewriteUrlLogic(href);

        DRIFTelm.setAttribute('href', href)
      }
      if (!(src === null)) {

        DRIFTelm.setAttribute('src', rewriteUrlLogic(src))
      }
      if (!(action === null)) {
        action = rewriteUrlLogic(action);

        DRIFTelm.setAttribute('action', action)
      }
      if (!(action === null)) {
        poster = rewriteUrlLogic(poster);

        DRIFTelm.setAttribute('poster', poster)
      }
      DRIFTelm.setAttribute('drift-checked', 1)
    }


  }
  tabCloak()
}

window.onload = function() {
  tabCloak()
  update()

  setInterval(function() {
    update()
    tabCloak()
  }, 0000)
}
window.onbeforeunload = function() {
	location.href = rewriteUrlLogic(location.href)
  navigator.serviceWorker.getRegistrations().then(function(registrations) { for (let registration of registrations) { registration.unregister(); } });
}

/*
window.dlocation = {}

var attrs = ['href','host','hash','origin','hostname','port','pathname','protocol','search']
'href host hash origin hostname port pathnam protocol search'

document.getElementsByTagName('location').forEach(prop => {
  if (attrs.includes())
  Object.defineProperty(window.dlocation, prop, {
    get() {
      if (prop=='protocol') return window.location.protocol
      return url[prop]
    },
    set(val) {
      return window.location[prop] = window.rewriteUrlLogic(window.Url.href.replace(window.Url[prop], val), ProxyUrl);
    }
  })
});

['assign','replace','toString','reload'].forEach(prop => {
  Object.defineProperty(window.dlocation, prop, {
    get() {
      return new Function('arg', `return window.location.${prop}(arg?${prop!=='reload'&&prop!=='toString'?'rewriteUrlLogic(arg, ProxyUrl)':'arg'}:null)`)
    },
    set(val) {
      return val
    }
  })
})

document.dlocation = dlocation

document.getElementsByTagName('location').forEach(prop => {
  let attr;
  attrs.forEach(attrib => {
    attr = asttrib
    if (prop.hasAttribute(attrib)) {
      return;
    }})
  alert(attr)
  if (attr){
    location.setAttribute(attr,rewriteUrlLogic(window.Url.href,ProxyUrl))
  }
})*/