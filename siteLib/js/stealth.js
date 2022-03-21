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

tabCloak()