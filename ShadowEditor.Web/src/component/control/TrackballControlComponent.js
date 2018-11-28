import BaseComponent from '../BaseComponent';

/**
 * 轨迹球控制器组件
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TrackballControlComponent(options) {
    BaseComponent.call(this, options);
    this.selected = null;
}

TrackballControlComponent.prototype = Object.create(BaseComponent.prototype);
TrackballControlComponent.prototype.constructor = TrackballControlComponent;

TrackballControlComponent.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'controlPanel',
        scope: this.id,
        parent: this.parent,
        cls: 'Panel',
        style: {
            borderTop: '1px solid #ddd',
            display: 'none'
        },
        children: [{
            xtype: 'row',
            children: [{
                xtype: 'label',
                style: {
                    color: '#555',
                    fontWeight: 'bold',
                    width: '100%'
                },
                text: '轨迹球控制器'
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '旋转速度'
            }, {
                xtype: 'number',
                id: 'rotateSpeed',
                scope: this.id,
                value: 1.0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '缩放速度'
            }, {
                xtype: 'number',
                id: 'zoomSpeed',
                scope: this.id,
                value: 1.2,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '平移速度'
            }, {
                xtype: 'number',
                id: 'panSpeed',
                scope: this.id,
                value: 0.3,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '不旋转'
            }, {
                xtype: 'checkbox',
                id: 'noRotate',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '不缩放'
            }, {
                xtype: 'checkbox',
                id: 'noZoom',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '不平移'
            }, {
                xtype: 'checkbox',
                id: 'noPan',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '静态移动'
            }, {
                xtype: 'checkbox',
                id: 'staticMoving',
                scope: this.id,
                value: false,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '减震系数'
            }, {
                xtype: 'number',
                id: 'dynamicDampingFactor',
                scope: this.id,
                value: 0.2,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '最小距离'
            }, {
                xtype: 'number',
                id: 'minDistance',
                scope: this.id,
                value: 0,
                onChange: this.onChange.bind(this)
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'label',
                text: '最大距离'
            }, {
                xtype: 'number',
                id: 'maxDistance',
                scope: this.id,
                value: 99999,
                onChange: this.onChange.bind(this)
            }]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`objectSelected.${this.id}`, this.onObjectSelected.bind(this));
    this.app.on(`objectChanged.${this.id}`, this.onObjectChanged.bind(this));
};

TrackballControlComponent.prototype.onObjectSelected = function () {
    this.updateUI();
};

TrackballControlComponent.prototype.onObjectChanged = function () {
    this.updateUI();
};

TrackballControlComponent.prototype.updateUI = function () {
    var container = UI.get('controlPanel', this.id);
    var editor = this.app.editor;
    if (editor.selected && editor.selected === this.app.editor.camera && editor.selected.userData.control === 'TrackballControls') {
        container.dom.style.display = '';
    } else {
        container.dom.style.display = 'none';
        return;
    }

    this.selected = editor.selected;

    var rotateSpeed = UI.get('rotateSpeed', this.id);
    var zoomSpeed = UI.get('zoomSpeed', this.id);
    var panSpeed = UI.get('panSpeed', this.id);
    var noRotate = UI.get('noRotate', this.id);
    var noZoom = UI.get('noZoom', this.id);
    var noPan = UI.get('noPan', this.id);
    var staticMoving = UI.get('staticMoving', this.id);
    var dynamicDampingFactor = UI.get('dynamicDampingFactor', this.id);
    var minDistance = UI.get('minDistance', this.id);
    var maxDistance = UI.get('maxDistance', this.id);


    var options = this.selected.userData.trackballOptions || {
        rotateSpeed: 1.0,
        zoomSpeed: 1.2,
        panSpeed: 0.3,
        noRotate: false,
        noZoom: false,
        noPan: false,
        staticMoving: false,
        dynamicDampingFactor: 0.2,
        minDistance: 0,
        maxDistance: 99999
    };

    if (this.selected.userData.trackballOptions === undefined) {
        this.selected.userData.trackballOptions = {};
        Object.assign(this.selected.userData.trackballOptions, options);
    }

    rotateSpeed.setValue(options.rotateSpeed);
    zoomSpeed.setValue(options.zoomSpeed);
    panSpeed.setValue(options.panSpeed);
    noRotate.setValue(options.noRotate);
    noZoom.setValue(options.noZoom);
    noPan.setValue(options.noPan);
    staticMoving.setValue(options.staticMoving);
    dynamicDampingFactor.setValue(options.dynamicDampingFactor);
    minDistance.setValue(options.minDistance);
    maxDistance.setValue(options.maxDistance);
};

TrackballControlComponent.prototype.onChange = function () {
    var rotateSpeed = UI.get('rotateSpeed', this.id);
    var zoomSpeed = UI.get('zoomSpeed', this.id);
    var panSpeed = UI.get('panSpeed', this.id);
    var noRotate = UI.get('noRotate', this.id);
    var noZoom = UI.get('noZoom', this.id);
    var noPan = UI.get('noPan', this.id);
    var staticMoving = UI.get('staticMoving', this.id);
    var dynamicDampingFactor = UI.get('dynamicDampingFactor', this.id);
    var minDistance = UI.get('minDistance', this.id);
    var maxDistance = UI.get('maxDistance', this.id);


    Object.assign(this.selected.userData.trackballOptions, {
        rotateSpeed: rotateSpeed.getValue(),
        zoomSpeed: zoomSpeed.getValue(),
        panSpeed: panSpeed.getValue(),
        noRotate: noRotate.getValue(),
        noZoom: noZoom.getValue(),
        noPan: noPan.getValue(),
        staticMoving: staticMoving.getValue(),
        dynamicDampingFactor: dynamicDampingFactor.getValue(),
        minDistance: minDistance.getValue(),
        maxDistance: maxDistance.getValue(),
    });
};

export default TrackballControlComponent;