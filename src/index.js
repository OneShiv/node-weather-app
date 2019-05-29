const path = require("path");
const express = require("express");
const hbs = require("hbs");
// creating a application using express
const app = express();
const request = require("request");
const port = process.env.PORT || 3001;

// defining public and views directory path if name other than views
const publicDirectoryPath = path.join(__dirname,"../public");
const viewsPath = path.join(__dirname,"../templates/views");
const partailsPath = path.join(__dirname,"../templates/partials");

// setting view engine and views 
app.set("view engine","hbs");
app.set("views",viewsPath);

// registering path for handling partials via handlebars

hbs.registerPartials(partailsPath);

// general passing from where should be static ontent served.
app.use(express.static(publicDirectoryPath));

app.get("/",(req,res)=>{
  res.render("index");
});

app.get("/weather",(req,res)=>{
  let location = req.query.location;
  let renderObj={};
  let url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+ encodeURIComponent(location)+".json?access_token=pk.eyJ1Ijoic2hpdm9uZSIsImEiOiJjanZnOHY1dncwNTZrNDNvY2gzdzN1M2R2In0.1Nv9jtXxM2fR9GH5eYAypg&limit=1";
  if(location){
    request({url,json:true},(error,response)=>{
      if(error){
        renderObj.status=404;
        return res.send({message:"No Connection"});
      }else if(response.body.features.length ===0){
        renderObj.status=200;
        renderObj.data=null
        return res.send({message:"Not a valid location"});
      }else{
        let latitude=response.body.features[0].center[1];
        let longitude=response.body.features[0].center[0];
        let longLat = latitude+","+longitude;
        console.log(longLat);
        let url2="https://api.darksky.net/forecast/100fbdce01d81877fd14ba9d366d77d1/"+longLat+"?units=si";
        console.log(url2);
        request({url:url2,json:true},(error,response)=>{
          if(error){
            return res.send({message:"No Connection"});
          } else {
            let data = response.body;
            let currently=data.currently.summary;
            let temprature=data.currently.temperature;
            let precip=data.currently.precipProbability*100;
            let message = "Currently temprature is "+temprature+". Weather is "+currently+". Chances of rain is"+precip+"%";
            return res.send({
              message
            });
          }
        });
      }
    });
  }else{
    res.send({
      message:"No location selected"
    });
  }
 
});

app.get("/about",(req,res)=>{
  res.render("about",{
    author:"Shiv Shankar"
  });
});

app.get("*",(req,res)=>{
  res.render("404page",{
    title:"Page Not Found"
  });
});

app.listen(port,()=>{
  console.log("server is started");
});
