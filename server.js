var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var cheerioTableparser = require('cheerio-tableparser');
var json2csv = require('json2csv');
var encoding = require("encoding");
var utf8 = require('utf8');
var app     = express();

app.get('/scrape', function(req, res){
  // Let's scrape Anchorman 2
  url = 'http://planzajec.uek.krakow.pl/index.php?typ=G&id=68141&okres=3';

  request(url, function(error, response, html){
    if(!error){
      var $ = cheerio.load(html,{ decodeEntities: false});

      var title, release, rating;
      var json = { title : "", release : "", rating : ""};
      var calendaryformat={Subject:"",}

      cheerioTableparser($);
      var data1 = $("table").parsetable();
      console.log(data1[0][1]);
      console.log(data1[4][1]);
      var result = utf8.encode(data1[3][3]);
      console.log(result);
      var fields = ['Subject', 'Start date', 'Start time','End date', 'End Time'];
      var calendary = [];
      var str = data1[1][1];
      var arr = str.split(" ");
      var des="";
      var teacherData = data1[4][3];
      var arr1 = teacherData.split("<");
      var teacher=arr1[0];
      console.log(teacher);



      for (var i = 1; i < data1[0].length; i++) {
        str = data1[1][i];
        arr = str.split(" ");
        if (data1[0][i] !== "") {

          if(data1[2][i]==="" && data1[3][i]==="lektorat"){
            des=data1[4][i];
          }else{
            teacherData=data1[4][i];
            arr1 = teacherData.split("<");
            teacher = arr1[0]
            if(data1[2][i]!==""){
              des+=data1[2][i]+", ";
            }

            if (data1[2][i] !== "") {
              des += data1[3][i]+", ";
            }

            des+=teacher+", "+data1[5][i];
          }

          calendary.push({

            "Subject": des,
            "Start date": data1[0][i],
            "Start time": arr[1],
            "End date": data1[0][i],
            "End Time": arr[3]

          });
          des="";
        }
      }

 

      var csv = json2csv({ data: calendary, fields: fields });

      fs.writeFile('file.csv', csv, 'utf8',function (err) {
        if (err) throw err;
        console.log('file saved');
      })

    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    })

    res.send('Check your console!')
  })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
