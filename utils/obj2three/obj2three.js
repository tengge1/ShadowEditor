// obj 转 three.js bin格式

var fs = require('fs');

THREE = require('../../node_modules/three/build/three.js');

require('../../third_party/loaders/OBJLoader.js');

var file = 'utils/model/box.obj';

var loader = new THREE.OBJLoader();

var text = fs.readFileSync(file, 'utf8');

var content = JSON.stringify(loader.parse(text).toJSON());

fs.writeFileSync(file.replace('.obj', '.json'), content, 'utf8');
