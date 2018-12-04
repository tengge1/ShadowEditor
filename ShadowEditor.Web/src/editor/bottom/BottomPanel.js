import Control from '../../ui/Control';
import AnimationPanel from './AnimationPanel';
import ModelPanel from './ModelPanel';
import MapPanel from './MapPanel';
import TexturePanel from './TexturePanel';
import MaterialPanel from './MaterialPanel';
import AudioPanel from './AudioPanel';
import ParticlePanel from './ParticlePanel';
import LogPanel from './LogPanel';

/**
 * 底部面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function BottomPanel(options) {
    Control.call(this, options);
    this.app = options.app;
    this.show = true;
};

BottomPanel.prototype = Object.create(Control.prototype);
BottomPanel.prototype.constructor = BottomPanel;

BottomPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        cls: 'sidebar bottomPanel',
        parent: this.parent,
        children: [{
            xtype: 'div',
            cls: 'tabs',
            style: {
                zIndex: 20,
                display: 'block',
            },
            children: [{
                xtype: 'text',
                id: 'animationTab',
                text: '动画',
                onClick: () => {
                    this.selectTab('animation');
                }
            }, {
                xtype: 'text',
                id: 'modelTab',
                text: '模型',
                onClick: () => {
                    this.selectTab('model');
                }
            }, {
                xtype: 'text',
                id: 'mapTab',
                text: '贴图',
                onClick: () => {
                    this.selectTab('map');
                }
            }, {
                xtype: 'text',
                id: 'textureTab',
                text: '纹理',
                onClick: () => {
                    this.selectTab('texture');
                }
            }, {
                xtype: 'text',
                id: 'materialTab',
                text: '材质',
                onClick: () => {
                    this.selectTab('material');
                }
            }, {
                xtype: 'text',
                id: 'audioTab',
                text: '音频',
                onClick: () => {
                    this.selectTab('audio');
                }
            }, {
                xtype: 'text',
                id: 'particleTab',
                text: '粒子',
                onClick: () => {
                    this.selectTab('particle');
                }
            }, {
                xtype: 'text',
                id: 'logTab',
                text: '日志',
                onClick: () => {
                    this.selectTab('log');
                }
            }, {
                xtype: 'iconbutton',
                icon: 'icon-down-arrow',
                title: '折叠',
                style: {
                    margin: '5px',
                    padding: '2px 4px',
                    boxSizing: 'border-box',
                    float: 'right'
                },
                onClick: this.toggleShowPanel.bind(this)
            }]
        }, {
            xtype: 'div',
            id: 'animationPanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new AnimationPanel({
                    app: this.app
                })
            ]
        }, {
            xtype: 'div',
            id: 'modelPanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new ModelPanel({
                    app: this.app
                })
            ]
        }, {
            xtype: 'div',
            id: 'mapPanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new MapPanel({
                    app: this.app
                })
            ]
        }, {
            xtype: 'div',
            id: 'texturePanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new TexturePanel({
                    app: this.app
                })
            ]
        }, {
            xtype: 'div',
            id: 'materialPanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new MaterialPanel({
                    app: this.app
                })
            ]
        }, {
            xtype: 'div',
            id: 'audioPanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new AudioPanel({
                    app: this.app
                })
            ]
        }, {
            xtype: 'div',
            id: 'particlePanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new ParticlePanel({
                    app: this.app
                })
            ]
        }, {
            xtype: 'div',
            id: 'logPanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new LogPanel({
                    app: this.app
                })
            ]
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`appStarted.${this.id}`, () => {
        this.selectTab('animation');
    });
};

BottomPanel.prototype.selectTab = function (tabName) {
    var animationTab = UI.get('animationTab');
    var modelTab = UI.get('modelTab');
    var mapTab = UI.get('mapTab');
    var textureTab = UI.get('textureTab');
    var materialTab = UI.get('materialTab');
    var audioTab = UI.get('audioTab');
    var particleTab = UI.get('particleTab');
    var logTab = UI.get('logTab');

    var animationPanel = UI.get('animationPanel');
    var modelPanel = UI.get('modelPanel');
    var mapPanel = UI.get('mapPanel');
    var texturePanel = UI.get('texturePanel');
    var materialPanel = UI.get('materialPanel');
    var audioPanel = UI.get('audioPanel');
    var particlePanel = UI.get('particlePanel');
    var logPanel = UI.get('logPanel');

    animationTab.dom.className = '';
    modelTab.dom.className = '';
    mapTab.dom.className = '';
    textureTab.dom.className = '';
    materialTab.dom.className = '';
    audioTab.dom.className = '';
    particleTab.dom.className = '';
    logTab.dom.className = '';

    animationPanel.dom.style.display = 'none';
    modelPanel.dom.style.display = 'none';
    mapPanel.dom.style.display = 'none';
    texturePanel.dom.style.display = 'none';
    materialPanel.dom.style.display = 'none';
    audioPanel.dom.style.display = 'none';
    particlePanel.dom.style.display = 'none';
    logPanel.dom.style.display = 'none';

    switch (tabName) {
        case 'animation':
            animationTab.dom.className = 'selected';
            animationPanel.dom.style.display = '';
            break;
        case 'model':
            modelTab.dom.className = 'selected';
            modelPanel.dom.style.display = '';
            break;
        case 'map':
            mapTab.dom.className = 'selected';
            mapPanel.dom.style.display = '';
            break;
        case 'texture':
            textureTab.dom.className = 'selected';
            texturePanel.dom.style.display = '';
            break;
        case 'material':
            materialTab.dom.className = 'selected';
            materialPanel.dom.style.display = '';
            break;
        case 'audio':
            audioTab.dom.className = 'selected';
            audioPanel.dom.style.display = '';
            break;
        case 'particle':
            particleTab.dom.className = 'selected';
            particlePanel.dom.style.display = '';
            break;
        case 'log':
            logTab.dom.className = 'selected';
            logPanel.dom.style.display = '';
            break;
    }

    this.app.call(`showBottomPanel`, this, tabName);
};

BottomPanel.prototype.toggleShowPanel = function () {

};

export default BottomPanel;