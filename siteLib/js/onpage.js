var updatedCheck = false

function validUrl(trUrl) {
  var regexpression = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  if (regexpression.test(trUrl)) {
    return true
  } else {
    return false
  }
}

var observeDOM = (function () {
  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function (obj, callback) {
    if (!obj || obj.nodeType !== 1) return;

    if (MutationObserver) {

      var mutationObserver = new MutationObserver(callback)

      mutationObserver.observe(obj, {
        childList: true,
        subtree: true
      })
      return mutationObserver
    } else if (window.addEventListener) {
      obj.addEventListener('DOMNodeInserted', callback, false)
      obj.addEventListener('DOMNodeRemoved', callback, false)
    }
  }
})()

async function update() {
  updatedCheck = true

  var DRIFTelements = document.querySelectorAll("*")

  for (let i = 0; i < DRIFTelements.length; i++) {
    var DRIFTelm = DRIFTelements[i]
    var DriftHref = DRIFTelm.getAttribute('drift-href')
    var DriftSrc = DRIFTelm.getAttribute('drift-src')
    var DriftAction = DRIFTelm.getAttribute('drift-action')

    //DRIFTelm.removeAttribute('integrity')

    if (DriftHref) {
      DRIFTelm.href = DriftHref
    }
    if (DriftSrc) {
      DRIFTelm.src = DriftSrc
    }
    if (DriftAction) {
      DRIFTelm.action = DriftAction
    }
  }
}

update()


/*observeDOM(document, function () {
  update()
})*/