import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 场景面板
 * @author mrdoob / http://mrdoob.com/
 */
function ScenePanel(options) {
    Control.call(this, options);
    this.app = options.app;
};

ScenePanel.prototype = Object.create(Control.prototype);
ScenePanel.prototype.constructor = ScenePanel;

ScenePanel.prototype.render = function () {
    var editor = this.app.editor;

    var _this = this;

    var onFogChanged = function () {
        var fogType = XType.getControl('fogType');
        var fogColor = XType.getControl('fogColor');
        var fogNear = XType.getControl('fogNear');
        var fogFar = XType.getControl('fogFar');
        var fogDensity = XType.getControl('fogDensity');

        _this.app.call('sceneFogChanged',
            _this,
            fogType.getValue(),
            fogColor.getHexValue(),
            fogNear.getValue(),
            fogFar.getValue(),
            fogDensity.getValue()
        );
    };

    var refreshFogUI = function () {
        _this.app.call('updateScenePanelFog', _this);
    };

    var data = {
        xtype: 'div',
        id: 'scenePanel',
        parent: this.parent,
        cls: 'Panel',
        children: [{ // outliner
            xtype: 'outliner',
            editor: editor,
            id: 'outliner',
            onChange: function () {
                _this.app.call('outlinerChange', _this, this);
            },
            onDblClick: function () {
                editor.focusById(parseInt(this.getValue()));
            }
        }, {
            xtype: 'br'
        }, { // background
            xtype: 'row',
            id: 'backgroundRow',
            children: [{
                xtype: 'label',
                text: '背景',
                style: 'width: 90px;'
            }, {
                xtype: 'color',
                id: 'backgroundColor',
                value: '#aaaaaa',
                onChange: function () {
                    _this.app.call('sceneBackgroundChanged', _this, this.getHexValue());
                }
            }]
        }, { // fog
            xtype: 'row',
            id: 'fogTypeRow',
            children: [{
                xtype: 'label',
                text: '雾',
                style: 'width: 90px'
            }, {
                xtype: 'select',
                id: 'fogType',
                options: {
                    'None': '无',
                    'Fog': '线性',
                    'FogExp2': '指数型'
                },
                style: 'width: 150px;',
                onChange: function () {
                    onFogChanged();
                    refreshFogUI();
                }
            }]
        }, {
            xtype: 'row',
            id: 'fogPropertiesRow',
            children: [{ // fog color
                xtype: 'color',
                id: 'fogColor',
                value: '#aaaaaa',
                onChange: onFogChanged
            }, { // fog near
                xtype: 'number',
                id: 'fogNear',
                value: 0.1,
                style: 'width: 40px;',
                range: [0, Infinity],
                onChange: onFogChanged
            }, { // fog far
                xtype: 'number',
                id: 'fogFar',
                value: 50,
                style: 'width: 40px;',
                range: [0, Infinity],
                onChange: onFogChanged
            }, { // fog density
                xtype: 'number',
                id: 'fogDensity',
                value: 0.05,
                style: 'width: 40px;',
                range: [0, 0.1],
                precision: 3,
                onChange: onFogChanged
            }]
        }]
    };

    var control = UI.create(data);
    control.render();
};

export default ScenePanel;