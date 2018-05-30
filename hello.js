/*eslint-env node*/

var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

function createURL(word) {
   var url = `https://tatoeba.org/rus/sentences/search?query=${word}&from=eng&to=rus&orphans=&unapproved=&user=&tags=&list=&has_audio=yes&trans_filter=limit&trans_to=rus&trans_link=&trans_user=&trans_orphan=&trans_unapproved=&trans_has_audio=&sort=random`;
   //console.log(url);
   return {
       'url': url,
       'headers': {
           'User-Agent': 'request'
           }
        };
}

function response_to_file(text) {
    fs.writeFile('/projects/test/tmp', text, (err) => {
        if (err) {
           return console.log('error writefile tmp');
        }
        console.log('file write');
    });
}

function callback(error, response, body) {
  if (!error && response.statusCode === 200) {
      let html = body.toString();
      response_to_file(html);
      let $ = cheerio.load(html);
      console.log($('.sentence-and-translations').text());
    }
}

var options = createURL('hello');

request(options, callback);