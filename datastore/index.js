const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(new Error('error'));
    } else {
      var data = _.map(files, (text, id) => {
        text = text.slice(0, 5);
        // console.log(text);
        return { id: '0000' + (id + 1), text: '0000' + (id + 1) };
      });
      callback(err, data);

      // return files;

    }
  });




  // callback(null, data);
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
      console.log('deleted');
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
