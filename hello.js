const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');

var URLlist = ['hello', 'word', 'sing'];

function createURL(word) {
   let url = `https://tatoeba.org/rus/sentences/search?query=${word}&from=eng&to=rus&orphans=&unapproved=&user=&tags=&list=&has_audio=yes&trans_filter=limit&trans_to=rus&trans_link=&trans_user=&trans_orphan=&trans_unapproved=&trans_has_audio=&sort=random`;
   //console.log(url);
   return {
       'url': url,
       'headers': {
           'User-Agent': 'request'
           }
        };
}

function response_to_file(text) {
    fs.writeFile('./tmp', text, (err) => {
        if (!err) {
            console.log('file write');
        } else {
            return console.log('error writefile tmp');
        }
    });
}

function grab_page(error, response, body) {
    if (!error && response.statusCode === 200) {
        let html = body.toString();
        response_to_file(html);
        let $ = cheerio.load(html);
        $('.sentence-and-translations').each((i, div) => {
            let sentence = $(div).find('.sentence .text').text().trim();
            let translation = $(div).find('.translations .text').first().text().trim();
            let id = $(div).find('a').first().text().trim().slice(1);
            console.log(sentence);
            console.log(translation);
            console.log(id);
            request('https://audio.tatoeba.org/sentences/eng/' +  id + '.mp3')
                .pipe(fs.createWriteStream('mp3/' + id  + '.mp3'));
            console.log(number++);
        });
    }
}

function grab_some_page(url_list) {
    let number = 0;
    for (let i = 0; i < url_list.length; i++) {
        console.log(url_list[i]);
        let options = createURL(url_list[i]);
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                let html = body.toString();
                response_to_file(html);
                let $ = cheerio.load(html);
                $('.sentence-and-translations').each((i, div) => {
                    let sentence = $(div).find('.sentence .text').text().trim();
                    let translation = $(div).find('.translations .text').first().text().trim();
                    let id = $(div).find('a').first().text().trim().slice(1);
                    console.log(sentence);
                    console.log(translation);
                    console.log(id);
                    request('https://audio.tatoeba.org/sentences/eng/' +  id + '.mp3')
                        .pipe(fs.createWriteStream('mp3/' + id  + '.mp3'));
                    console.log(number++);
                });
            }
        });
    }
}

grab_some_page(URLlist);
