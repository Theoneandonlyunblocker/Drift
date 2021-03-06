function xor(key,text){
  var result = ""
  for (let i = 0; i < text.length; i++){
    var c = text.charCodeAt(i)
    var k = key.charCodeAt(i*key.length)
    result += String.fromCharCode(c ^ k)
    
  }
  return result
}

function encodeString(text){
  var enc = xor('pass', '-https://google.com').toString('base64')
  enc = xor('pass', '-https://google.com').toString('base64').slice(0,enc.length)
  return enc
}

function decodeString(text){
  var dec = xor('pass', text).toString('base64')
  return dec.re
}

let c = init("canvas"),
  w = (canvas.width = window.innerWidth),
  h = (canvas.height = window.innerHeight);
//initiation

class firefly {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.s = Math.random() * 2;
    this.ang = Math.random() * 2 * Math.PI;
    this.v = this.s * this.s / 4;
  }
  move() {
    this.x += this.v * Math.cos(this.ang);
    this.y += this.v * Math.sin(this.ang);
    this.ang += Math.random() * 20 * Math.PI / 180 - 10 * Math.PI / 180;
  }
  show() {
    c.beginPath();
    c.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
    c.fillStyle = "#fddba3";
    c.fill();
  }
}

let f = [];

function draw() {
  if (f.length < 100) {
    for (let j = 0; j < 10; j++) {
      f.push(new firefly());
    }
  }
  //animation
  for (let i = 0; i < f.length; i++) {
    f[i].move();
    f[i].show();
    if (f[i].x < 0 || f[i].x > w || f[i].y < 0 || f[i].y > h) {
      f.splice(i, 1);
    }
  }
}

let mouse = {};
let last_mouse = {};

canvas.addEventListener(
  "mousemove",
  function(e) {
    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
  },
  false
);
function init(elemid) {
  let canvas = document.getElementById(elemid),
    c = canvas.getContext("2d"),
    w = (canvas.width = window.innerWidth),
    h = (canvas.height = window.innerHeight);
  c.fillStyle = "rgba(30,30,30,1)";
  c.fillRect(0, 0, w, h);
  return c;
}

window.requestAnimFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback);
    }
  );
});

function loop() {
  window.requestAnimFrame(loop);
  c.clearRect(0, 0, w, h);
  draw();
}

window.addEventListener("resize", function() {
  (w = canvas.width = window.innerWidth),
    (h = canvas.height = window.innerHeight);
  loop();
});

loop();
setInterval(loop, 1000 / 60);

function password() {
  var pass = document.getElementById('proxyUrl').value;
  if (pass === "eisnotacolor") {
    document.cookie = "dev=true"
  } else {
    document.cookie = "dev=false"
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

function visit() {

}

function tabCloak() {
  var iframe = document.createElement('iframe')
  iframe.src = document.getElementById('proxyUrl').value;
  iframe.style.display = "none"
  document.body.appendChild(iframe);
  
  function getFavicon(doc) {
    var favicon = undefined;
    var nodeList = doc.getElementsByTagName("link");
    for (var i = 0; i < nodeList.length; i++) {
      if ((nodeList[i].getAttribute("rel") == "icon") || (nodeList[i].getAttribute("rel") == "shortcut icon")) {
        favicon = nodeList[i].getAttribute("href");
      }
    }
    return favicon;
  }

  favInput = getFavicon(iframe.contentWindow.window.document.body.innerHTML)
  title = iframe.contentWindow.document.title

  console.log(favInput,title)
  document.cookie = `titleCloak=${title}`
  document.cookie = `faviconCloak=${favInput}`
}

function isValidURL(str) {
  var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
}

function proxy() {
  var inputUrl = document.getElementById('proxyUrl').value;
  inputUrl = inputUrl.replace("https://", "")
  inputUrl = inputUrl.replace("http://", "")

  document.cookie = 'proxyPath=/main'
  inputUrl = decodeURI(inputUrl)
  const engines = {
	 google: 'www.google.com/search?q=',
	 youtube: 'www.youtube.com/results?search_query=',
	 bing: 'bing.com/search?q=',
	 brave: 'search.brave.com/search?q=',
	 twitter: 'twitter.com/search?q=',
	 reddit: 'www.reddit.com/search/?q=',
	 gigablast: 'gigablast.com/search?c=main&q='
	};
	var action = '/main/'+engines.google+inputUrl
  if (isValidURL(inputUrl)) {
    document.cookie = 'proxyURL='+'/main/'+inputUrl
  } else {
    document.cookie = 'proxyURL='+action
  }

}

visit();