import Control from '../ui/Control';
import XType from '../ui/XType';

/**
 * 场景信息面板
 * @author mrdoob / http://mrdoob.com/
 */
function ViewportInfo(options) {
    Control.call(this, options);
};

ViewportInfo.prototype = Object.create(Control.prototype);
ViewportInfo.prototype.constructor = ViewportInfo;

ViewportInfo.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'info',
        children: [{
            xtype: 'label',
            text: '物体'
        }, {
            xtype: 'text',
            id: 'objectsText',
            text: '0' // 物体数
        }, {
            xtype: 'br'
        }, {
            xtype: 'label',
            text: '顶点'
        }, {
            xtype: 'text',
            id: 'verticesText',
            text: '0' // 顶点数
        }, {
            xtype: 'br'
        }, {
            xtype: 'label',
            text: '三角形'
        }, {
            xtype: 'text',
            id: 'trianglesText',
            text: '0' // 三角形数
        }]
    };

    var control = XType.create(data);
    control.parent = this.parent;
    control.render();
};

export default ViewportInfo;