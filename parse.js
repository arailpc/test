const fs = require('fs');

var lineReader = require('readline').createInterface({
  input: fs.createReadStream('/projects/test/5000.txt')
});

lineReader.on('line', function (line) {
  console.log(line.split('-'));
  
});