import MenuEvent from '../MenuEvent';
import AddObjectCommand from '../../../command/AddObjectCommand';
import UI from '../../../ui/UI';

var ID = -1;

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

    var ctx = canvas.getContext('2d');
    ctx.font = '24px 微软雅黑';
    ctx.textBaseline = 'top';

    var padding = 8;
    var textMetrics = ctx.measureText(text);
    canvas.width = (textMetrics.width + padding * 2);
    canvas.height = (24 + padding * 2);

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillText(text, padding, padding);

    var geometry = new THREE.PlaneBufferGeometry(canvas.width / 10, canvas.height / 10);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: new THREE.CanvasTexture(canvas)
    });

    var mesh = new THREE.Mesh(geometry, material);
    mesh.name = text;
    this.app.editor.scene.add(mesh);
};

export default AddTextEvent;