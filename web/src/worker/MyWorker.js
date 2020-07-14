class MyWorker {
    constructor() {
        window.onmessage = function (e) {
            console.log('worker: ', e);
        };
    }
}