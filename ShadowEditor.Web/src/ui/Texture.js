import Control from './Control';
import UI from './Manager';

/**
 * 纹理
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function Texture(options) {
    Control.call(this, options);
    options = options || {};

    this.mapping = options.mapping || THREE.UVMapping;

    this.onChange = options.onChange || null;
}

Texture.prototype = Object.create(Control.prototype);
Texture.prototype.constructor = Texture;

Texture.prototype.render = function () {
    this.dom = document.createElement('div');

    this.dom.className = 'Texture';

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
    this.dom.appendChild(this.name);

    this.parent.appendChild(this.dom);

    this.texture = null;
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
            if (texture.sourceFile) {
                name.value = texture.sourceFile;
            } else {
                name.value = '';
            }

            var scale = canvas.width / image.width;
            context.drawImage(image, 0, 0, image.width * scale, image.height * scale);
        } else {
            name.value = (texture.sourceFile == null ? '' : texture.sourceFile) + L_ERROR;
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
    var _this = this;

    if (file.type.match('image.*')) {
        var reader = new FileReader();

        if (file.type === 'image/targa') {
            reader.addEventListener('load', function (event) {
                var canvas = new THREE.TGALoader().parse(event.target.result);
                var texture = new THREE.CanvasTexture(canvas, _this.mapping);

                texture.sourceFile = file.name;

                _this.setValue(texture);

                if (_this.onChange) {
                    _this.onChange();
                }
            }, false);

            reader.readAsArrayBuffer(file);
        } else {
            reader.addEventListener('load', function (event) {
                var image = document.createElement('img');

                image.addEventListener('load', function (event) {
                    var texture = new THREE.Texture(this, _this.mapping);
                    texture.sourceFile = file.name;
                    texture.format = file.type === 'image/jpeg' ? THREE.RGBFormat : THREE.RGBAFormat;
                    texture.needsUpdate = true;

                    _this.setValue(texture);

                    if (_this.onChange) {
                        _this.onChange();
                    }
                }, false);

                image.src = event.target.result;
            }, false);

            reader.readAsDataURL(file);
        }
    }

    this.form.reset();
};

UI.addXType('texture', Texture);

export default Texture;