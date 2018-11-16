import StringUtils from '../../utils/StringUtils';

/**
 * 文本
 * @param {*} text 文字
 */
function Text(text = '文字') {
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

    var map = new THREE.CanvasTexture(canvas);

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

export default Text;