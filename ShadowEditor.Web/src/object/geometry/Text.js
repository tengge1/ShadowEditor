/**
 * 文本
 * @param {*} text 文字
 */
function Text(text = L_TEXT) {
    var canvas = document.createElement('canvas');

    var fontSize = 64;

    var ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px 'Microsoft YaHei'`;

    var textMetrics = ctx.measureText(text);
    canvas.width = textMetrics.width;
    canvas.height = fontSize;
    ctx.textBaseline = 'hanging';
    ctx.font = `${fontSize}px 'Microsoft YaHei'`; // 重新设置画布大小，前面设置的ctx属性全部失效

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillText(text, (canvas.width - textMetrics.width) / 2, 0);

    var map = new THREE.CanvasTexture(canvas);
    map.minFilter = THREE.LinearFilter;

    var geometry = new THREE.PlaneBufferGeometry(canvas.width / 10, canvas.height / 10);
    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: map,
        transparent: true
    });

    THREE.Mesh.call(this, geometry, material);

    this.name = text;
}

Text.prototype = Object.create(THREE.Mesh.prototype);
Text.prototype.constructor = Text;

Text.prototype.updateText = function (text) {
    this.name = text;

    var canvas = this.material.map.image;

    var fontSize = 64;

    var ctx = canvas.getContext('2d');
    ctx.font = `${fontSize}px 'Microsoft YaHei'`;

    var textMetrics = ctx.measureText(text);
    canvas.width = textMetrics.width;
    canvas.height = fontSize;
    ctx.textBaseline = 'hanging';
    ctx.font = `${fontSize}px 'Microsoft YaHei'`; // 重新设置画布大小，前面设置的ctx属性全部失效

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillText(text, (canvas.width - textMetrics.width) / 2, 0);

    this.material.map.needsUpdate = true;
};

export default Text;