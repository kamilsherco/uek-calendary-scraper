var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var cheerioTableparser = require('cheerio-tableparser');
var json2csv = require('json2csv');
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
      var dataFromHtml = $("table").parsetable();
      console.log(dataFromHtml[0][1]);
      console.log(dataFromHtml[4][1]);
      var result = utf8.encode(dataFromHtml[3][3]);
      console.log(result);
      var fields = ['Subject','Description', 'Start date', 'Start time','End date', 'End Time'];
      var calendary = [];
	  var subject="";
      var dateString = dataFromHtml[1][1];
      var dateArray = dateString.split(" ");
      var description="";
      var teacherString = dataFromHtml[4][3];
      var teacherData = teacherString.split("<");
      var teacher=teacherData[0];
      console.log(teacher);



      for (var i = 1; i < dataFromHtml[0].length; i++) {
        dateString = dataFromHtml[1][i];
        dateArray = dateString.split(" ");
        if (dataFromHtml[0][i] !== "") {

          if(dataFromHtml[2][i]==="" && dataFromHtml[3][i]==="lektorat"){
            subject=dataFromHtml[4][i];
          }else{
            teacherString=dataFromHtml[4][i];
            teacherData = teacherString.split("<");
            teacher = teacherData[0];
			teacher=teacher.slice(0, -1);
            if(dataFromHtml[2][i]!==""){
              subject+=dataFromHtml[2][i];
            }
			description+=teacher+", ";
            if (dataFromHtml[2][i] !== "") {
              description += dataFromHtml[3][i]+", ";
            }

            description+=dataFromHtml[5][i];
          }

          calendary.push({

            "Subject": subject,
			"Description":description,
            "Start date": dataFromHtml[0][i],
            "Start time": dateArray[1],
            "End date": dataFromHtml[0][i],
            "End Time": dateArray[3]

          });
          description="";
		  subject="";
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
