const r = require("link-checker-malicious");

const BlockedCatagories = ['true','false','false','false','true','false','false']
const BlockedSites = ['netflix.com','accounts.google.com']

function detectCatagory(link) {
	try {
		var url = new URL(link)
	} catch {
		var url = new URL('https://'+link)
	}
	const cam = r.is_cam(link)
	const dating = r.is_dating(link);
	const gambling = r.is_gambling(link);
	const pirated = r.is_pirated(link);
	const ip = r.is_ip_grabber(link);
	const nsfw = r.is_nsfw(link);
	const scam = r.is_scam(link);
	const uncatogorized = r.is_unk(link);
	
	if (dating || nsfw || pirated || cam || BlockedSites.includes(url.hostname)){
		return true
	} else {
		return false
	}
}

function filter(req, res, next) {
	var url = req.originalUrl.split('/main')

	if (url.length === 2) {
		url = url[1]
		url = url.substr(1, url.length)
		if (detectCatagory(url)){
			res.sendFile(__dirname.replace('/siteLib/js','')+'/views/blocked.html')
		} else {
			next()
		}
	} else {
		next()
	}
}

module.exports = { filter }