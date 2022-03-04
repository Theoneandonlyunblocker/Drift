var url = require('url');
const request = require('request')
const https = require('https')
var express = require('express')
var app = express()
const rewriter = require('./lib/rewriter.js')
var content_type = require('./lib/contentType.js')

app.set('view engine', 'hbs');

function getcookie(req) {
  const parseCookie = str =>
  str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      
      return acc;
    }, {});
  
    var cookie = req.headers.cookie;
    cookie.toString()

    cookie = parseCookie(cookie)
    
    return cookie['proxyUrl']
}

app.get('/proxy/*',function(req,res){
  try {
  var proxyUrl = req.originalUrl.substr(7,req.originalUrl.length)

  proxyUrl = proxyUrl.replace("https:/","")
  proxyUrl = proxyUrl.replace("http:/","")
  
  proxyUrl = `https://${proxyUrl}`

  
  request(proxyUrl, function (error, response, body) {
  
  try {
  var contentType = response.caseless.get('Content-Type')
  } catch {
    var contentType = "application/javascript"
  }
  try {
  res.set({'Content-Type':response.caseless.get('Content-Type')})
      } catch {
    res.set({"Content-Type":'application/javascript'})
      }
  
  if (contentType.includes("image")){
    console.log("Image")
    request({
    url: url,
    encoding: null
  },
  (err, resp, buffer) => {

    if (!err && resp.statusCode === 200){
      res.set({"Content-Type":contentType});
      res.send(resp.body);
    }
  });
  } else {
  try {
  res.send(rewriter.write(body,proxyUrl,response.caseless.get('Content-Type')));
  } catch {
    console.log(body)
    res.send(rewriter.write(body,proxyUrl,contentType));
  }
  }});
  } catch {
    res.sendFile('500.html',{"root":__dirname+"/views"})
  }
});

app.post('/',function(req,res){
  var proxyUrl = getcookie(req)

  proxyUrl = proxyUrl.replace("https:/","")
  proxyUrl = proxyUrl.replace("http:/","")
  
  proxyUrl = `https://${proxyUrl}`

  
  request(proxyUrl, function (error, response, body) {
  
  try {
  var contentType = response.caseless.get('Content-Type')
  } catch {
    var contentType = "application/javascript"
  }
  try {
  res.set({'Content-Type':response.caseless.get('Content-Type')})
      } catch {
    res.set({"Content-Type":'application/javascript'})
      }
  
  if (contentType.includes("image")){
    console.log("Image")
    request({
    url: url,
    encoding: null
  },
  (err, resp, buffer) => {

    if (!err && resp.statusCode === 200){
      res.set({"Content-Type":contentType});
      res.send(resp.body);
    }
  });
  } else {
  try {
  res.send(rewriter.write(body,proxyUrl,response.caseless.get('Content-Type')));
  } catch {
    console.log(body)
    res.send(rewriter.write(body,proxyUrl,contentType));
  }
  }});
  
});


app.get('/',function(req,res){
  res.sendFile("index.html",{"root":__dirname+"/views"})
})

app.get('/content/*',function(req,res) {
  let url = req.originalUrl.substr(9,req.originalUrl.length)
    res.sendFile('siteLib/'+url,{
    "root":__dirname
  })
})


app.listen(5000,function(){
  console.log("Running")
})