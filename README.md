### **Drift Web Proxy**

> My first (successful) web proxy!
> To Use Drift With Your Websites Use The Code Here



    const Drift = require('drift-npm')
    var express = require('express')
    var app = express()
    
    //This has to be /main/
    app.get("/main/*",function(req,res){
        drift.server(req,res);
      })

    app.get("/drift/:file",function(req,res){
      console.log(req.params.file)
      drift.contentSrc(req.params.file)
    })
    
    app.listen(8080,function(){
          console.log("Running")
    }
    
