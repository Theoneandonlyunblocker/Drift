const BlockedSites = []

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