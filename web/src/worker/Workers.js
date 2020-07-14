import MyWorker from 'worker!./MyWorker.js';

var myWorker = new MyWorker();
myWorker.postMessage('Hello, world!');