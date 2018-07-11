// three.js bin 转 obj 格式

var fs = require('fs');

THREE = require('../../node_modules/three/build/three.js');

require('../../third_party/loaders/BinaryLoader.js');
require('../../third_party/exporters/OBJExporter.js');

var file = 'utils/model/box.json';

var text = fs.readFileSync(file, 'utf8');
var json = JSON.parse(text);



// var text = fs.readFileSync(file, 'utf8');

// var content = JSON.stringify(loader.parse(text).toJSON());

// fs.writeFileSync(file.replace('.obj', '.json'), content, 'utf8');
