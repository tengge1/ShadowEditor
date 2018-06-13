import Element from './Element';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function Texture(mapping) {

    Element.call(this);

    var scope = this;

    var dom = document.createElement('span');

    var form = document.createElement('form');

    var input = document.createElement('input');
    input.type = 'file';
    input.addEventListener('change', function (event) {

        loadFile(event.target.files[0]);

    });
    form.appendChild(input);

    var canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 16;
    canvas.style.cursor = 'pointer';
    canvas.style.marginRight = '5px';
    canvas.style.border = '1px solid #888';
    canvas.addEventListener('click', function (event) {

        input.click();

    }, false);
    canvas.addEventListener('drop', function (event) {

        event.preventDefault();
        event.stopPropagation();
        loadFile(event.dataTransfer.files[0]);

    }, false);
    dom.appendChild(canvas);

    var name = document.createElement('input');
    name.disabled = true;
    name.style.width = '64px';
    name.style.border = '1px solid #ccc';
    dom.appendChild(name);

    function loadFile(file) {

        if (file.type.match('image.*')) {

            var reader = new FileReader();

            if (file.type === 'image/targa') {

                reader.addEventListener('load', function (event) {

                    var canvas = new THREE.TGALoader().parse(event.target.result);

                    var texture = new THREE.CanvasTexture(canvas, mapping);
                    texture.sourceFile = file.name;

                    scope.setValue(texture);

                    if (scope.onChangeCallback) scope.onChangeCallback();

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

                        scope.setValue(texture);

                        if (scope.onChangeCallback) scope.onChangeCallback();

                    }, false);

                    image.src = event.target.result;

                }, false);

                reader.readAsDataURL(file);

            }

        }

        form.reset();

    }

    this.dom = dom;
    this.texture = null;
    this.onChangeCallback = null;

    return this;

};

Texture.prototype = Object.create(Element.prototype);
Texture.prototype.constructor = Texture;

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

Texture.prototype.onChange = function (callback) {

    this.onChangeCallback = callback;

    return this;

};

export default Texture;