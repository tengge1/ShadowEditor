import MyWorker from 'worker!./my-worker.js';

var myWorker = new MyWorker();
myWorker.onmessage = function (evt) {
    if (evt.data === 'hello') {
        myWorker.postMessage('hello back!');
    }
};

export { myWorker };