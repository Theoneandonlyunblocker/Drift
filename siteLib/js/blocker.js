const BlockedSites = ['accounts.google.com','pornhub.com','rule34.xxx','netflix.com', 'xvideos.com','xnxx.com','sex.com']

function filter(req,res,next){
	var url = req.originalUrl.split('/main')

	if (url.length===2){
		try {
		url = url[1]
		url = url.substr(1,url.length)

		if (BlockedSites.includes(url)){
				res.render('blocked',{'site':url})
			} else {
				next()
			}
		} catch {
			next()
		}
	} else {
		next()
	}
}

module.exports = { filter }