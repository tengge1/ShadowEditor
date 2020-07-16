import '../util/LercDecode';

self.onmessage = e => {
    let tileKey = e.data.tileKey;
    let x = e.data.column;
    let y = e.data.row;
    let z = e.data.levelNumber + 1;

    let xhr = new XMLHttpRequest();
    let url = `http://localhost:2020/api/Map/Elevation?x=${x}&y=${y}&z=${z}`;

    xhr.open("GET", url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                self.postMessage({
                    result: 'success',
                    tileKey,
                    url,
                    data: xhr.response
                });
            } else {
                self.postMessage({
                    result: 'fail',
                    msg: xhr.statusText,
                    tileKey,
                    url
                });
            }
        }
    };

    xhr.onerror = function () {
        self.postMessage({
            result: 'error',
            tileKey,
            url
        });
    };

    xhr.ontimeout = function () {
        self.postMessage({
            result: 'timeout',
            tileKey,
            url
        });
    };

    xhr.send(null);
};