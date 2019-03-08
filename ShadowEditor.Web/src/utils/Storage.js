/**
 * 存储类
 */
function Storage() {

}

Storage.prototype.length = {
    get: function () {
        return window.localStorage.length;
    }
};

Storage.prototype.get = function (key) {
    return window.localStorage.getItem(key);
};

Storage.prototype.set = function (key, value) {
    window.localStorage.setItem(key, value);
};

Storage.prototype.remove = function (key) {
    window.localStorage.removeItem(key);
};

Storage.prototype.clear = function () {
    window.localStorage.clear();
};

export default Storage;