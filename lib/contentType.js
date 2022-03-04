var mime = require('mime');
const https = require('https');
const download = require('download');
var request = require('request')
var mime = require('mime');
var fs = require('fs')

function detectFile(fileUrl){
  const resp = request.get(fileUrl,function(err, res) {
    return res.caseless.get('content-type')
    
  })
  return resp
};

module.exports = {  detectFile };