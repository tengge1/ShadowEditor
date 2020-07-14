import MyWorker from 'worker!./MyWorker.js';

var myWorker = new MyWorker();
myWorker.onmessage = function () {
    myWorker.postMessage('hello world!');
};