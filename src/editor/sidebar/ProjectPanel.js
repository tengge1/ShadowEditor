import { System } from '../../third_party';
import Control from '../../ui/Control';
import XType from '../../ui/XType';

/**
 * 工程面板
 * @author mrdoob / http://mrdoob.com/
 */
function ProjectPanel(options) {
    Control.call(this, options);
    this.app = options.app;
};

ProjectPanel.prototype = Object.create(Control.prototype);
ProjectPanel.prototype.constructor = ProjectPanel;

ProjectPanel.prototype.render = function () {
    var editor = this.app.editor;
    var config = editor.config;

    var rendererTypes = {
        'WebGLRenderer': THREE.WebGLRenderer,
        'CanvasRenderer': THREE.CanvasRenderer,
        'SVGRenderer': THREE.SVGRenderer,
        'SoftwareRenderer': THREE.SoftwareRenderer,
        'RaytracingRenderer': THREE.RaytracingRenderer
    };

    var options = {};

    for (var key in rendererTypes) {
        if (key.indexOf('WebGL') >= 0 && System.support.webgl === false) continue;
        options[key] = key;
    }

    var data = {
        xtype: 'div',
        id: 'projectPanel',
        parent: this.parent,
        style: 'border-top: 0; padding-top: 20px;',
        cls: 'Panel',
        children: [{ // class
            xtype: 'row',
            id: 'rendererTypeRow',
            children: [{
                xtype: 'label',
                id: 'rendererType',
                text: '渲染器',
                style: 'width: 90px;'
            }, {
                xtype: 'select',
                options: options,
                value: config.getKey('project/renderer'),
                style: 'width: 150px; ',
                onChange: function () {
                    var value = this.getValue();
                    config.setKey('project/renderer', value);
                    updateRenderer();
                }
            }]
        }, {
            xtype: 'row',
            id: 'rendererPropertiesRow',
            style: 'margin-left: 90px',
            children: [{ // antialiasing
                xtype: 'boolean',
                id: 'rendererAntialias',
                value: config.getKey('project/renderer/antialias'),
                text: '抗锯齿',
                onChange: function () {
                    config.setKey('project/renderer/antialias', this.getValue());
                    updateRenderer();
                }
            }, { // shadow
                xtype: 'boolean',
                id: 'rendererShadows',
                value: config.getKey('project/renderer/shadows'),
                text: '阴影',
                onChange: function () {
                    config.setKey('project/renderer/shadows', this.getValue());
                    updateRenderer();
                }
            }, {
                xtype: 'br'
            }, { // gamma input
                xtype: 'boolean',
                id: 'rendererGammaInput',
                value: config.getKey('project/renderer/gammaInput'),
                text: 'γ输入',
                onChange: function () {
                    config.setKey('project/renderer/gammaInput', this.getValue());
                    updateRenderer();
                }
            }, { // gamma output
                xtype: 'boolean',
                id: 'rendererGammaOutput',
                value: config.getKey('project/renderer/gammaOutput'),
                text: 'γ输出',
                onChange: function () {
                    config.setKey('project/renderer/gammaOutput', this.getValue());
                    updateRenderer();
                }
            }]
        }, { // VR
            xtype: 'row',
            id: 'vrRow',
            children: [{
                xtype: 'label',
                text: '虚拟现实',
                style: 'width: 90px;'
            }, {
                xtype: 'checkbox',
                id: 'vr',
                value: config.getKey('project/vr'),
                style: 'left: 100px;',
                onChange: function () {
                    config.setKey('project/vr', this.getValue());
                    // updateRenderer();
                }
            }]
        }]
    };

    var control = XType.create(data);
    control.render();

    //

    function updateRenderer() {
        createRenderer(rendererType.getValue(), rendererAntialias.getValue(), rendererShadows.getValue(), rendererGammaInput.getValue(), rendererGammaOutput.getValue());
    }

    var _this = this;

    function createRenderer(type, antialias, shadows, gammaIn, gammaOut) {
        if (type === 'WebGLRenderer' && System.support.webgl === false) {
            type = 'CanvasRenderer';
        }

        rendererPropertiesRow.dom.style.display = type === 'WebGLRenderer' ? '' : 'none';

        var renderer = new rendererTypes[type]({ antialias: antialias });
        renderer.gammaInput = gammaIn;
        renderer.gammaOutput = gammaOut;
        if (shadows && renderer.shadowMap) {

            renderer.shadowMap.enabled = true;
            // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        }

        _this.app.call('rendererChanged', _this, renderer);
    }

    createRenderer(config.getKey('project/renderer'), config.getKey('project/renderer/antialias'), config.getKey('project/renderer/shadows'), config.getKey('project/renderer/gammaInput'), config.getKey('project/renderer/gammaOutput'));
};

export default ProjectPanel;