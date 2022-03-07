function validUrl(trUrl) {
  var regexpression = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

  if (regexpression.test(trUrl)) {
    return true
  } else {
    return false
  }
}

function update() {
  console.log("Updating Elms")
  
  var DRIFTelements = document.querySelectorAll("*")
  for (let i = 0; i < DRIFTelements.length; i++) {
    var DRIFTelm = DRIFTelements[i]
    var href = DRIFTelm.getAttribute('drift-href')
    var src = DRIFTelm.getAttribute('drift-src')
    var action = DRIFTelm.getAttribute('drift-action')

    //DRIFTelm.removeAttribute('integrity')
    
    if (href) {
      DRIFTelm.href = href
    }
    if (src) {
      DRIFTelm.src = src
    }
    if (action) {
      DRIFTelm.action = action
    }
  }
}

setInterval(function(){
  update()
}, 500)