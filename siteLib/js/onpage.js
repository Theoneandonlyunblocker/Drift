var updatedCheck = false

function validUrl(trUrl) {
  var regexpression = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  if (regexpression.test(trUrl)) {
    return true
  } else {
    return false
  }
}

/*window.ProxyUrl = location.href.replace('/main/', '').replace(location.origin, '').replace('https://', 'https:/').replace('https:/', 'https://')
console.log(window.ProxyUrl)
window.Url = new URL('https://'+window.ProxyUrl)
*/
function rewriteLogic(url, path) {
  let rewritten
  if (url.startsWith('https://')) {
    rewritten = `/main/${url}`
  } else {
    if (url.startsWith('/')) {
      rewritten = `/main/${path}/${url}`
        
    } else {
      rewritten = `/main/${path}/${path}/${url}`
    }
  }
  return rewritten
}
//This is not actually being used so I'ma just go do that
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
  console.log("Updating")

  var DRIFTelements = document.querySelectorAll("*")

  for (let i = 0; i < DRIFTelements.length; i++) {
    var DRIFTelm = DRIFTelements[i]
    var DriftHref = DRIFTelm.getAttribute('drift-href')
    var DriftSrc = DRIFTelm.getAttribute('drift-src')
    var DriftAction = DRIFTelm.getAttribute('drift-action')
    var href = DRIFTelm.getAttribute('href')
    var src = DRIFTelm.getAttribute('src')
    var action = DRIFTelm.getAttribute('action')

    if (!(DriftHref === null)) {
      DRIFTelm.href = DriftHref
    } else {
      if (!(href === null)) {
        href = rewriteLogic(href,window.ProxyPath);
        DRIFTelm.setAttribute('drift-href', href)
      }
    }
    if (!(DriftSrc === null)) {
      DRIFTelm.src = DriftSrc
    } else {
      if (!(src === null)) {
        href = rewriteLogic(src,window.ProxyPath);
        DRIFTelm.setAttribute('drift-src', src)
      }
    }
    if (!(DriftAction === null)) {
      DRIFTelm.action = DriftAction
    } else {
      if (!(action === null)) {
        action = rewriteLogic(action,window.ProxyPath);
        DRIFTelm.setAttribute('drift-action', action)
      }
    }

    
  }
  tabCloak()
}

tabCloak()
update()

setInterval(function() {
  observeDOM(document, function() {
    if (updatedCheck === "true") {
      update()
    }
  })
}, 5000)

setInterval(function(){
  tabCloak()
}, 1000)

window.XMLHttpRequest.prototype.open = new Proxy(window.XMLHttpRequest.prototype.open, {
  apply(t, g, a) {
    if (a[1]) a[1] = rewriteLogic(a[1], ProxyUrl)
    return Reflect.apply(t, g, a)
  }
});

window.dlocation = {}

var attrs = ['href','host','hash','origin','hostname','port','pathname','protocol','search']
'href host hash origin hostname port pathnam protocol search'

/*document.getElementsByTagName('location').forEach(prop => {
  if (attrs.includes())
  Object.defineProperty(window.dlocation, prop, {
    get() {
      if (prop=='protocol') return window.location.protocol
      return url[prop]
    },
    set(val) {
      return window.location[prop] = window.rewriteLogic(window.Url.href.replace(window.Url[prop], val), ProxyUrl);
    }
  })
});

['assign','replace','toString','reload'].forEach(prop => {
  Object.defineProperty(window.dlocation, prop, {
    get() {
      return new Function('arg', `return window.location.${prop}(arg?${prop!=='reload'&&prop!=='toString'?'rewriteLogic(arg, ProxyUrl)':'arg'}:null)`)
    },
    set(val) {
      return val
    }
  })
})

document.dlocation = dlocation

//location prox*/

document.getElementsByTagName('location').forEach(prop => {
  let attr;
  attrs.forEach(attrib => {
    attr = asttrib
    if (prop.hasAttribute(attrib)) {
      return;
    }})
  alert(attr)
  if (attr){
    location.setAttribute(attr,rewriteLogic(window.Url.href,ProxyUrl))
  }
})