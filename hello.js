const request = require('request');
const fs = require('fs');
const cheerio = require('cheerio');
const sqlite3 = require('sqlite3');
const parse = require('./parse');

var URLlist = ['hello', 'process', 'inevitable', 'father'];

function createURL(word, page) {
   let url = `https://tatoeba.org/rus/sentences/search/page:${page}?query=${word}&from=eng&to=rus&orphans=&unapproved=&user=&tags=&list=&has_audio=yes&trans_filter=limit&trans_to=rus&trans_link=&trans_user=&trans_orphan=&trans_unapproved=&trans_has_audio=&sort=random`;
   console.log(url);
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

class progress {
    constructor() {
        this.word = '';
        this.page_number = 1;
        this.max = 50;
        this.c = 0;
        this.c_on_page = 0;
        this.sentences = [];
        this.translations = [];
        this.sentences_on_page =0;
    }

    add(sentence, translation) {
        this.c++;
        this.c_on_page++;
        this.sentences.push(sentence);
        this.translations.push(translation);
        // console.log(this.translations, this.c);
        if (this.c_on_page >= this.sentences_on_page) {
            if(this.sentences_on_page < 10 || this.c >= this.max)  {
                this.finish();
                return;
            }
            this.c_on_page = 0;
            this.next_page();
        }

    }
    set_sentences_on_page (number) {
        this.sentences_on_page = number;
        if (this.sentences_on_page === 0) {
            this.finish();
        }
    }
    next_page() {
        this.page_number++;
        request(createURL(this.word, this.page_number), grab_page.bind(this));
    }
    start (word) {
        this.word = word;
        request(createURL(this.word, 1), grab_page.bind(this));
    }
    finish() {
        console.log(this);
    }
}

function grab_page(error, response, body) {
    if (!error && response.statusCode === 200) {
        let html = body.toString();
        // response_to_file(html);
        let $ = cheerio.load(html);
        this.set_sentences_on_page($('.sentence-and-translations').length);
        var that = this;
        $('.sentence-and-translations').each((i, div) => {
            let sentence = $(div).find('.sentence .text').text().trim();
            let translation = $(div).find('.translations .text').first().text().trim();
            let id = $(div).find('a').first().text().trim().slice(1);
            request('https://audio.tatoeba.org/sentences/eng/' +  id + '.mp3')
                .pipe(fs.createWriteStream('/projects/test/mp3/' + id  + '.mp3'));
            that.add(sentence, translation);
        });
    } else {
        this.finish();
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
                // response_to_file(html);
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


//for (let i = 0; i < URLlist.length; i++) {
//    (new progress()).start(URLlist[i]);
//}

//let db = new sqlite3.Database('/projects/test/newdb.db', (err) => {
//  if (err) {
//    return console.error(err.message);
//  }
//  console.log('Connected to the SQlite database.');
//});

//let sql = `SELECT PlaylistId id,
//                  Name name
//           FROM playlists
//           WHERE PlaylistId  = ?`;
//let playlistId = 1;
// 
//
//db.get(sql, [playlistId], (err, row) => {
//  if (err) {
//    return console.error(err.message);
//  }
//  return row
//    ? console.log(row.id, row.name)
//    : console.log(`No playlist found with the id ${playlistId}`);
//});
// 

//let sql = `CREATE TABLE words(id integer PRIMARY KEY,
// word text NOT NULL
//);`;
//
//db.get(sql, []);

//let sql = `INSERT INTO words (
// id,
// word)
//VALUES
// (?, ?);`;
//
//db.get(sql, [1, 'hello']);

//let sql = `SELECT id,
//                  word       
//           FROM words
//           WHERE id  = ?`;
//let id = 2;
// 
//
//db.get(sql, [id], (err, row) => {
//  if (err) {
//    return console.error(err.message);
//  }
//  return row
//    ? console.log(row.id, row.word)
//    : console.log(`No playlist found with the id ${id}`);
//});
//
//
//db.close((err) => {
//  if (err) {
//    console.error(err.message);
//  }
//  console.log('Close the database connection.');
//});



