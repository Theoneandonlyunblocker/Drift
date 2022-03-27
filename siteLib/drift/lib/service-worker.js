const config = {
  "prefix": "/main"
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

var proxyUrl = cookieStore.get('proxyUrl').value

function rewriteUrlLogic(link, dlocation) {
  let rewritten
  if (link.startsWith("https://") || link.startsWith("http://") || link.startsWith("//")) {
    link = link.replace("https://", "")
    link = link.replace("https:/", "")
    link = link.replace("http://", "")
    link = link.replace("http:/", "")
    link = link.replace("//", "")

    if (link.toString().charAt(link.length - 1) == '/') {
      rewritten = `${config.prefix}/${link}`
    } else {
      rewritten = `${config.prefix}/${link}/`
    }

  } else {
    if (link.startsWith('//')) {
      rewritten = `${config.prefix}/${link}`
    } else {
      if (link === "/") {
        rewritten = `${config.prefix}/${dlocation}`
      } else {
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

self.addEventListener('install', function (event) {
  console.log("Service Worker Installed")
});

self.addEventListener('activate', function (event) {
  console.log("Service Worker Activated")
});

self.addEventListener('fetch', (event) => {
  const eventUrl = new URL(event.request.url);
  const pathAndQuery = eventUrl.pathname + eventUrl.search;
  //console.log(location.protocol+"//"+location.hostname)
  if (!(eventUrl.href.startsWith(location.protocol+"//"+location.hostname))) {
    event.respondWith(
      fetch(
        rewriteUrlLogic(eventUrl.href,proxyUrl)
      )
    )
  }
})