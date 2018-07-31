import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';
import UI from '../../../ui/UI';
import StringUtils from '../../../utils/StringUtils';

/**
 * 添加文本事件
 * @param {*} app 
 */
function AddTextEvent(app) {
    MenuEvent.call(this, app);
}

AddTextEvent.prototype = Object.create(MenuEvent.prototype);
AddTextEvent.prototype.constructor = AddTextEvent;

AddTextEvent.prototype.start = function () {
    this.app.on(`mAddText.${this.id}`, this.onAddText.bind(this));
};

AddTextEvent.prototype.stop = function () {
    this.app.on(`mAddText.${this.id}`, null);
};

AddTextEvent.prototype.onAddText = function () {
    UI.prompt('请输入', null, '一些文字', (event, value) => {
        this.drawText(value);
    });
};

AddTextEvent.prototype.drawText = function (text) {
    var canvas = document.createElement('canvas');

    var fontSize = 64;

    var ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px sans-serif`;

    var textMetrics = ctx.measureText(text);
    canvas.width = StringUtils.makePowOfTwo(textMetrics.width);
    canvas.height = fontSize;
    ctx.textBaseline = 'hanging';
    ctx.font = `${fontSize}px sans-serif`; // 重新设置画布大小，前面设置的ctx属性全部失效

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillText(text, (canvas.width - textMetrics.width) / 2, 0);

    var map = new THREE.CanvasTexture(canvas, );

    var geometry = new THREE.PlaneBufferGeometry(canvas.width / 10, canvas.height / 10);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: map,
        transparent: true
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = text;

    var editor = this.app.editor;

    editor.execute(new AddObjectCommand(mesh));
};

export default AddTextEvent;