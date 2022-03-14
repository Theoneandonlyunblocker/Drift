var updatedCheck = false

function validUrl(trUrl) {
	var regexpression = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

	if (regexpression.test(trUrl)) {
		return true
	} else {
		return false
	}
}

function tabCloak() {
	var favicon = getCookie('faviconCloak')
	var titleCloal = getCookie('titleCloak')

	console.log(favicon)

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
		var href = DRIFTelm.getAttribute('href')
		var src = DRIFTelm.getAttribute('src')
		var action = DRIFTelm.getAttribute('action')

		if (!(DriftHref === null)) {
			DRIFTelm.href = DriftHref
		} else {
			if ((!(href === null)) && DriftHref === null) {
				DRIFTelm.setAttribute('drift-href', href)
			}
		}
		if (!(DriftSrc === null)) {
			DRIFTelm.src = DriftSrc
		} else {
			if ((!(src === null)) && DriftSrc === null) {
				DRIFTelm.setAttribute('drift-src', src)
			}
		}
		if (!(DriftAction === null)) {
			DRIFTelm.action = DriftAction
		} else {
			if ((!(action === null)) && DriftAction === null) {
				DRIFTelm.setAttribute('drift-action', action)
			}
		}
	}
	tabCloak()
}

update()

setInterval(function() {
	update()
}, 3000)