import Control from './Control';

/**
 * 纹理
 * @param {*} options 
 */
function Texture(options) {
    Control.call(this, options);
}

Texture.prototype = Object.create(Control.prototype);
Texture.prototype.constructor = Texture;

Texture.prototype.render = function () {
    this.dom = document.createElement('span');

    this.form = document.createElement('form');

    this.input = document.createElement('input');
    this.input.type = 'file';

    var _this = this;
    this.input.addEventListener('change', function (event) {
        _this.loadFile(event.target.files[0]);
    });
    this.form.appendChild(this.input);

    this.canvas = document.createElement('canvas');
    this.canvas.width = 32;
    this.canvas.height = 16;
    this.canvas.style.cursor = 'pointer';
    this.canvas.style.marginRight = '5px';
    this.canvas.style.border = '1px solid #888';

    this.canvas.addEventListener('click', function (event) {
        _this.input.click();
    }, false);

    this.canvas.addEventListener('drop', function (event) {
        event.preventDefault();
        event.stopPropagation();
        _this.loadFile(event.dataTransfer.files[0]);
    }, false);

    this.dom.appendChild(this.canvas);

    this.name = document.createElement('input');
    this.name.disabled = true;
    this.name.style.width = '64px';
    this.name.style.border = '1px solid #ccc';
    this.dom.appendChild(this.name);

    this.parent.appendChild(this.dom);
    this.texture = null;
    this.onChangeCallback = null;
};

Texture.prototype.getValue = function () {
    return this.texture;
};

Texture.prototype.setValue = function (texture) {

    var canvas = this.dom.children[0];
    var name = this.dom.children[1];
    var context = canvas.getContext('2d');

    if (texture !== null) {
        var image = texture.image;

        if (image !== undefined && image.width > 0) {
            name.value = texture.sourceFile;

            var scale = canvas.width / image.width;
            context.drawImage(image, 0, 0, image.width * scale, image.height * scale);
        } else {
            name.value = texture.sourceFile + ' (error)';
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

    } else {

        name.value = '';

        if (context !== null) {

            // Seems like context can be null if the canvas is not visible
            context.clearRect(0, 0, canvas.width, canvas.height);

        }
    }

    this.texture = texture;
};

Texture.prototype.loadFile = function (file) {

    if (file.type.match('image.*')) {

        var reader = new FileReader();
        if (file.type === 'image/targa') {
            reader.addEventListener('load', function (event) {
                var canvas = new THREE.TGALoader().parse(event.target.result);
                var texture = new THREE.CanvasTexture(canvas, mapping);
                texture.sourceFile = file.name;

                _this.setValue(texture);

                if (_this.onChangeCallback) {
                    _this.onChangeCallback();
                }
            }, false);

            reader.readAsArrayBuffer(file);

        } else {

            reader.addEventListener('load', function (event) {

                var image = document.createElement('img');
                image.addEventListener('load', function (event) {

                    var texture = new THREE.Texture(this, mapping);
                    texture.sourceFile = file.name;
                    texture.format = file.type === 'image/jpeg' ? THREE.RGBFormat : THREE.RGBAFormat;
                    texture.needsUpdate = true;

                    _this.setValue(texture);

                    if (_this.onChangeCallback) {
                        _this.onChangeCallback();
                    }

                }, false);

                image.src = event.target.result;

            }, false);

            reader.readAsDataURL(file);
        }
    }

    _this.form.reset();
};

Texture.prototype.onChange = function (callback) {
    this.onChangeCallback = callback;

    return this;
};

export default Texture;