import Control from '../../ui/Control';
import TimePanel from './TimePanel';
import ScenePanel from './ScenePanel';
import ModelPanel from './ModelPanel';
import MapPanel from './MapPanel';
import MaterialPanel from './MaterialPanel';
import AudioPanel from './AudioPanel';
import AnimationPanel from './AnimationPanel';
import ParticlePanel from './ParticlePanel';
import PrefabPanel from './PrefabPanel';
import CharacterPanel from './CharacterPanel';
import LogPanel from './LogPanel';

/**
 * 底部面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function BottomPanel(options) {
    Control.call(this, options);
    app = options.app;
    this.show = true;
};

BottomPanel.prototype = Object.create(Control.prototype);
BottomPanel.prototype.constructor = BottomPanel;

BottomPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        id: 'bottomPanel',
        scope: this.id,
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
                id: 'timeTab',
                text: L_TIME,
                onClick: () => {
                    this.selectTab('time');
                }
            }, {
                xtype: 'text',
                id: 'sceneTab',
                text: L_SCENE,
                onClick: () => {
                    this.selectTab('scene');
                }
            }, {
                xtype: 'text',
                id: 'modelTab',
                text: L_MODEL,
                onClick: () => {
                    this.selectTab('model');
                }
            }, {
                xtype: 'text',
                id: 'mapTab',
                text: L_MAP,
                onClick: () => {
                    this.selectTab('map');
                }
            }, {
                xtype: 'text',
                id: 'materialTab',
                text: L_MATERIAL,
                onClick: () => {
                    this.selectTab('material');
                }
            }, {
                xtype: 'text',
                id: 'audioTab',
                text: L_AUDIO,
                onClick: () => {
                    this.selectTab('audio');
                }
            }, {
                xtype: 'text',
                id: 'animationTab',
                text: L_ANIMATION,
                onClick: () => {
                    this.selectTab('animation');
                }
            }, {
                xtype: 'text',
                id: 'particleTab',
                text: L_PARTICLE,
                onClick: () => {
                    this.selectTab('particle');
                }
            }, {
                xtype: 'text',
                id: 'prefabTab',
                text: L_PREFAB,
                onClick: () => {
                    this.selectTab('prefab');
                }
            }, {
                xtype: 'text',
                id: 'characterTab',
                text: L_CHARACTER,
                onClick: () => {
                    this.selectTab('character');
                }
            }, {
                xtype: 'text',
                id: 'logTab',
                text: L_LOG,
                onClick: () => {
                    this.selectTab('log');
                }
            }, {
                xtype: 'div',
                style: {
                    display: 'inline-block',
                    float: 'right'
                },
                children: [{
                    xtype: 'iconbutton',
                    icon: 'icon-sort',
                    title: '排序',
                    style: {
                        margin: '5px',
                        padding: '2px 4px',
                        boxSizing: 'border-box'
                    },
                    onClick: this.onSort.bind(this)
                }, {
                    xtype: 'iconbutton',
                    id: 'maximizeBtn',
                    scope: this.id,
                    icon: 'icon-maximize',
                    title: '最大化',
                    style: {
                        margin: '5px 5px 5px 0',
                        padding: '2px 4px',
                        boxSizing: 'border-box'
                    },
                    onClick: this.onMaximize.bind(this)
                }, {
                    xtype: 'iconbutton',
                    id: 'collapseBtn',
                    scope: this.id,
                    icon: 'icon-down-arrow',
                    title: L_COLLAPSE,
                    style: {
                        margin: '5px 5px 5px 0',
                        padding: '2px 4px',
                        boxSizing: 'border-box'
                    },
                    onClick: this.toggleShowPanel.bind(this)
                }]
            }]
        }, {
            xtype: 'div',
            id: 'timePanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new TimePanel({
                    app: app
                })
            ]
        }, {
            xtype: 'div',
            id: 'scenePanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new ScenePanel({
                    app: app
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
                    app: app
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
                    app: app
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
                    app: app
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
                    app: app
                })
            ]
        }, {
            xtype: 'div',
            id: 'animationPanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new AnimationPanel({
                    app: app
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
                    app: app
                })
            ]
        }, {
            xtype: 'div',
            id: 'prefabPanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new PrefabPanel({
                    app: app
                })
            ]
        }, {
            xtype: 'div',
            id: 'characterPanel',
            style: {
                height: 'calc(100% - 40px)'
            },
            children: [
                new CharacterPanel({
                    app: app
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
                    app: app
                })
            ]
        }]
    };

    var control = UI.create(data);
    control.render();

    app.on(`appStarted.${this.id}`, () => {
        this.selectTab('time');
        this.updateAssetsInfo();
    });

    app.on(`selectBottomPanel.${this.id}`, this.onSelectPanel.bind(this));
};

BottomPanel.prototype.selectTab = function (tabName) {
    app.call(`selectBottomPanel`, this, tabName);
};

BottomPanel.prototype.onSelectPanel = function (tabName) {
    var timeTab = UI.get('timeTab');
    var sceneTab = UI.get('sceneTab');
    var modelTab = UI.get('modelTab');
    var mapTab = UI.get('mapTab');
    var materialTab = UI.get('materialTab');
    var audioTab = UI.get('audioTab');
    var animationTab = UI.get('animationTab');
    var particleTab = UI.get('particleTab');
    var prefabTab = UI.get('prefabTab');
    var characterTab = UI.get('characterTab');
    var logTab = UI.get('logTab');

    var timePanel = UI.get('timePanel');
    var scenePanel = UI.get('scenePanel');
    var modelPanel = UI.get('modelPanel');
    var mapPanel = UI.get('mapPanel');
    var materialPanel = UI.get('materialPanel');
    var audioPanel = UI.get('audioPanel');
    var animationPanel = UI.get('animationPanel');
    var particlePanel = UI.get('particlePanel');
    var prefabPanel = UI.get('prefabPanel');
    var characterPanel = UI.get('characterPanel');
    var logPanel = UI.get('logPanel');

    timeTab.dom.className = '';
    sceneTab.dom.className = '';
    modelTab.dom.className = '';
    mapTab.dom.className = '';
    materialTab.dom.className = '';
    audioTab.dom.className = '';
    animationTab.dom.className = '';
    particleTab.dom.className = '';
    prefabTab.dom.className = '';
    characterTab.dom.className = '';
    logTab.dom.className = '';

    timePanel.dom.style.display = 'none';
    scenePanel.dom.style.display = 'none';
    modelPanel.dom.style.display = 'none';
    mapPanel.dom.style.display = 'none';
    materialPanel.dom.style.display = 'none';
    audioPanel.dom.style.display = 'none';
    animationPanel.dom.style.display = 'none';
    particlePanel.dom.style.display = 'none';
    prefabPanel.dom.style.display = 'none';
    characterPanel.dom.style.display = 'none';
    logPanel.dom.style.display = 'none';

    switch (tabName) {
        case 'time':
            timeTab.dom.className = 'selected';
            timePanel.dom.style.display = '';
            break;
        case 'scene':
            sceneTab.dom.className = 'selected';
            scenePanel.dom.style.display = '';
            break;
        case 'model':
            modelTab.dom.className = 'selected';
            modelPanel.dom.style.display = '';
            break;
        case 'map':
            mapTab.dom.className = 'selected';
            mapPanel.dom.style.display = '';
            break;
        case 'material':
            materialTab.dom.className = 'selected';
            materialPanel.dom.style.display = '';
            break;
        case 'audio':
            audioTab.dom.className = 'selected';
            audioPanel.dom.style.display = '';
            break;
        case 'animation':
            animationTab.dom.className = 'selected';
            animationPanel.dom.style.display = '';
            break;
        case 'particle':
            particleTab.dom.className = 'selected';
            particlePanel.dom.style.display = '';
            break;
        case 'prefab':
            prefabTab.dom.className = 'selected';
            prefabPanel.dom.style.display = '';
            break;
        case 'character':
            characterTab.dom.className = 'selected';
            characterPanel.dom.style.display = '';
            break;
        case 'log':
            logTab.dom.className = 'selected';
            logPanel.dom.style.display = '';
            break;
    }

    app.call(`showBottomPanel`, this, tabName);
};

BottomPanel.prototype.updateAssetsInfo = function () {
    var sceneTab = UI.get('sceneTab');
    var modelTab = UI.get('modelTab');
    var mapTab = UI.get('mapTab');
    var materialTab = UI.get('materialTab');
    var audioTab = UI.get('audioTab');
    var animationTab = UI.get('animationTab');
    var particleTab = UI.get('particleTab');
    var prefabTab = UI.get('prefabTab');
    var characterTab = UI.get('characterTab');

    fetch(`${app.options.server}/api/Assets/List`).then(response => {
        if (response.ok) {
            response.json().then(json => {
                sceneTab.setValue(`${L_SCENE}(${json.sceneCount})`);
                modelTab.setValue(`${L_MODEL}(${json.meshCount})`);
                mapTab.setValue(`${L_MAP}(${json.mapCount})`);
                materialTab.setValue(`${L_MATERIAL}(${json.materialCount})`);
                audioTab.setValue(`${L_AUDIO}(${json.audioCount})`);
                animationTab.setValue(`${L_ANIMATION}(${json.animationCount})`);
                particleTab.setValue(`${L_PARTICLE}(${json.particleCount})`);
                prefabTab.setValue(`${L_PREFAB}(${json.prefabCount})`);
                characterTab.setValue(`${L_CHARACTER}(${json.characterCount})`);
            });
        }
    });
};

BottomPanel.prototype.onSort = function () {
    UI.msg('排序');
};

BottomPanel.prototype.onMaximize = function () {
    var bottomPanel = UI.get('bottomPanel', this.id);
    var maximizeBtn = UI.get('maximizeBtn', this.id);
    var collapseBtn = UI.get('collapseBtn', this.id);

    if (this.isMaximized === undefined) { // 当前状态：正常
        this.isMaximized = true;
        maximizeBtn.setTitle('正常化');
        maximizeBtn.setIcon('icon-minimize');
        collapseBtn.hide();

        this.oldLeft = bottomPanel.dom.style.left;
        this.oldTop = bottomPanel.dom.style.top;
        this.oldRight = bottomPanel.dom.style.right;
        this.oldBottom = bottomPanel.dom.style.bottom;
        this.oldHeight = bottomPanel.dom.style.height;
        this.oldZIndex = bottomPanel.dom.style.zIndex;

        Object.assign(bottomPanel.dom.style, {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            height: '100%',
            zIndex: 1000,
        });
    } else { // 当前状态：最大化
        Object.assign(bottomPanel.dom.style, {
            left: this.oldLeft,
            top: this.oldTop,
            right: this.oldRight,
            bottom: this.oldBottom,
            height: this.oldHeight,
            zIndex: this.oldZIndex,
        });

        delete this.isMaximized;
        delete this.oldLeft;
        delete this.oldTop;
        delete this.oldRight;
        delete this.oldBottom;
        delete this.oldHeight;
        delete this.oldZIndex;
        maximizeBtn.setTitle('最大化');
        maximizeBtn.setIcon('icon-maximize');
        collapseBtn.show();
    }
};

BottomPanel.prototype.toggleShowPanel = function () {
    var bottomPanel = UI.get('bottomPanel', this.id);
    var collapseBtn = UI.get('collapseBtn', this.id);
    var maximizeBtn = UI.get('maximizeBtn', this.id);
    var viewport = UI.get('viewport');

    if (this.isCollapsed === undefined) {
        this.isCollapsed = true;
        collapseBtn.setTitle('展开');
        collapseBtn.setIcon('icon-up-arrow');
        maximizeBtn.hide();

        this.oldBottom = bottomPanel.dom.style.bottom;
        this.oldViewportBottom = viewport.dom.style.bottom;

        Object.assign(bottomPanel.dom.style, {
            bottom: '-168px',
        });

        Object.assign(viewport.dom.style, {
            bottom: '72px',
        });
    } else {
        Object.assign(bottomPanel.dom.style, {
            bottom: this.oldBottom,
        });

        Object.assign(viewport.dom.style, {
            bottom: this.oldViewportBottom,
        });

        delete this.oldBottom;
        delete this.oldViewportBottom;
        delete this.isCollapsed;
        collapseBtn.setTitle('折叠');
        collapseBtn.setIcon('icon-down-arrow');
        maximizeBtn.show();
    }

    app.call('resize', this);
};

export default BottomPanel;