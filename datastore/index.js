const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promised = require('bluebird'); //added, needs to not be be Promise since that overlaps with the js function which is similar

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(new Error('error'));
    } else {
      // items[id] = text; //items[counterstring] = text

      var filepath = path.join(exports.dataDir, `${id}.txt`);
      // console.log('filepath is: ', filepath, '__dirname is: ', __dirname);
      fs.writeFile(filepath, text, (err) => {
        if (err) {
          callback(new Error('error'));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

//promisfy all of the functions here, will probably have to use promisyreadAll
//since we dont know how many readfiles we wil need?
//promise all takes in a bucnch of functions, if they all succed then it runs a then function

//what promises do I have here?
//first promise if to chek if the directory exists
//if it does then the next promise is to check if the file exists and map through it

//if successful then get then create an array obj and retur that at the end of readall

exports.readAll = (callback) => {
  var promisesArr = [];
  var readDir = Promised.promisify(fs.readdir);
  // var readFile = Promised.promisify(fs.readFile);
  var readOneAsync = Promised.promisify(exports.readOne);

  readDir(exports.dataDir)
    .then(function (filenames) {


      for (var i = 0; i < filenames.length; i++) {
        filename = filenames[i].slice(0, 5);
        promisesArr.push(readOneAsync(filename));

      }

      Promise.all(promisesArr)
        .then((element) => { //element is what is returned after running the promises

          callback(null, element);
        });

    });


};

exports.readOne = (id, callback) => {

  var filepath = path.join(exports.dataDir, `${id}.txt`);
  // fs.readdir(filepath, (err, files) => {
  //   console.log(files);
  //   if (err) {
  //     callback(new Error('error'));
  //   } else {
  //     console.log(files);
  //   }

  fs.readFile(filepath, 'utf8', function (err, text) {
    if (err) {
      callback(new Error('error'));
    } else {
      callback(null, { id, text });
      return { text };
    }
  });



  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  // }
};

exports.update = (id, text, callback) => {
  //if file path throws err, we throw err
  //else on sucess case, do the below thing
  var filepath = path.join(exports.dataDir, `${id}.txt`);

  fs.access(filepath, err => {
    if (err) {
      callback(new Error('error'));
    } else {
      fs.writeFile(filepath, text, function (err) {
        if (err) {
          callback(new Error('error'));
        } else {
          callback(null, { id, text });
        }

      });
    }
  });

};





// var item = items[id];
// if (!item) {
//   callback(new Error(`No item with id: ${id}`));
// } else {
//   items[id] = text;
//   callback(null, { id, text });
// }
// };

exports.delete = (id, callback) => {
  var filepath = path.join(exports.dataDir, `${id}.txt`);
  fs.unlink(filepath, (err) => {
    if (err) {
      callback(new Error('error'));
    } else {
      // console.log('deleted');
      callback(null);
    }
  });


  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
