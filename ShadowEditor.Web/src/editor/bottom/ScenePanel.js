import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import SceneEditWindow from '../window/SceneEditWindow';
import Converter from '../../serialization/Converter';
import AnimationGroup from '../../animation/AnimationGroup';
import Animation from '../../animation/Animation';

/**
 * 场景面板
 * @author tengge / https://github.com/tengge1
 */
function ScenePanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;

    this.firstShow = true;

    this.keywords = '';
    this.data = [];
};

ScenePanel.prototype = Object.create(UI.Control.prototype);
ScenePanel.prototype.constructor = ScenePanel;

ScenePanel.prototype.render = function () {
    this.app.on(`showBottomPanel.${this.id}`, this.onShowPanel.bind(this));
};

ScenePanel.prototype.onShowPanel = function (tabName) {
    if (tabName !== 'scene') {
        return;
    }

    if (this.firstShow) {
        this.firstShow = false;
        this.renderUI();
        this.update();
    }
};

ScenePanel.prototype.renderUI = function () {
    var control = UI.create({
        xtype: 'div',
        parent: this.parent,
        style: {
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'row',
        },
        children: [{
            xtype: 'div',
            style: {
                width: '200px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                borderRight: '1px solid #ddd',
            },
            children: [{
                xtype: 'div',
                style: {
                    display: 'flex'
                },
                children: [{
                    xtype: 'iconbutton',
                    icon: 'icon-save',
                    style: {
                        padding: '2px'
                    },
                    onClick: this.onSave.bind(this)
                }, {
                    xtype: 'searchfield',
                    id: 'search',
                    scope: this.id,
                    showSearchButton: false,
                    showResetButton: true,
                    onInput: this.onSearch.bind(this)
                }]
            }, {
                xtype: 'div',
                style: {
                    height: 'calc(100% - 30px)'
                },
                children: [{
                    xtype: 'category',
                    options: {
                        category1: '分类1',
                        category2: '分类2',
                        category3: '分类3',
                        category4: '分类4',
                        category5: '分类5',
                        category6: '分类6',
                        category7: '分类7',
                        category8: '分类8',
                    }
                }]
            }]
        }, {
            xtype: 'div',
            style: {
                width: '100%',
                height: '100%',
                flex: 1,
                overflow: 'auto'
            },
            children: [{
                xtype: 'imagelist',
                id: 'images',
                scope: this.id,
                style: {
                    width: '100%',
                    height: '100%',
                },
                onClick: this.onClick.bind(this)
            }]
        }]
    });

    control.render();
};

ScenePanel.prototype.update = function () {
    var server = this.app.options.server;

    this.keywords = '';

    Ajax.getJson(`${server}/api/Scene/List`, obj => {
        this.data = obj.Data;
        this.onSearch('');
    });
};

ScenePanel.prototype.onSearch = function (name) {
    if (name.trim() === '') {
        this.renderList(this.data);
        return;
    }

    name = name.toLowerCase();

    var list = this.data.filter(n => {
        return n.Name.indexOf(name) > -1 ||
            n.FirstPinYin.indexOf(name) > -1 ||
            n.TotalPinYin.indexOf(name) > -1;
    });

    this.renderList(list);
};

ScenePanel.prototype.renderList = function (list) {
    var images = UI.get('images', this.id);
    images.clear();

    images.children = list.map(n => {
        return {
            xtype: 'image',
            src: n.Thumbnail ? n.Thumbnail : null,
            title: n.Name,
            data: n,
            icon: 'icon-scenes',
            style: {
                backgroundColor: '#eee'
            }
        };
    });;

    images.render();
};

ScenePanel.prototype.onClick = function (event, index, btn, control) {
    var data = control.children[index].data;

    if (btn === 'edit') {
        if (typeof (this.onEdit) === 'function') {
            this.onEdit(data);
        }
    } else if (btn === 'delete') {
        if (typeof (this.onDelete) === 'function') {
            this.onDelete(data);
        }
    } else {
        if (typeof (this.onClick) === 'function') {
            this.onLoad(data);
        }
    }
};

// ------------------------------------- 加载场景 ------------------------------------

ScenePanel.prototype.onLoad = function (data) {
    var app = this.app;
    var editor = app.editor;
    var server = app.options.server;
    document.title = data.Name;

    Ajax.get(`${server}/api/Scene/Load?ID=${data.ID}`, (json) => {
        var obj = JSON.parse(json);

        editor.clear(false);

        (new Converter()).fromJson(obj.Data, {
            server: this.app.options.server,
            camera: this.app.editor.camera
        }).then(obj => {
            this.onLoadScene(obj);

            editor.sceneID = data.ID;
            editor.sceneName = data.Name;
            document.title = data.Name;

            // 添加帮助器
            editor.scene.traverse(n => {
                editor.addHelper(n);
            });

            if (obj.options) {
                this.app.call('optionsChanged', this, this.app.options);
            }

            if (obj.scripts) {
                this.app.call('scriptChanged', this);
            }

            if (obj.animation) {
                this.app.editor.animation.setAnimationGroups(obj.animation.map(n => {
                    return new AnimationGroup({
                        id: n.id,
                        uuid: n.uuid,
                        name: n.name,
                        index: n.index,
                        animations: n.animations.map(m => {
                            return new Animation({
                                // 基本信息
                                id: m.id,
                                uuid: m.uuid,
                                name: m.name,
                                target: m.target,
                                type: m.type,
                                beginTime: m.beginTime,
                                endTime: m.endTime,

                                // 补间动画
                                beginStatus: m.beginStatus,
                                beginPositionX: m.beginPositionX,
                                beginPositionY: m.beginPositionY,
                                beginPositionZ: m.beginPositionZ,
                                beginRotationX: m.beginRotationX,
                                beginRotationY: m.beginRotationY,
                                beginRotationZ: m.beginRotationZ,
                                beginScaleLock: m.beginScaleLock,
                                beginScaleX: m.beginScaleX,
                                beginScaleY: m.beginScaleY,
                                beginScaleZ: m.beginScaleZ,
                                ease: m.ease,
                                endStatus: m.endStatus,
                                endPositionX: m.endPositionX,
                                endPositionY: m.endPositionY,
                                endPositionZ: m.endPositionZ,
                                endRotationX: m.endRotationX,
                                endRotationY: m.endRotationY,
                                endRotationZ: m.endRotationZ,
                                endScaleLock: m.endScaleLock,
                                endScaleX: m.endScaleX,
                                endScaleY: m.endScaleY,
                                endScaleZ: m.endScaleZ
                            })
                        })
                    })
                }));
                this.app.call('animationChanged', this);
            }

            if (obj.scene) {
                this.app.call('sceneGraphChanged', this);
            }

            UI.msg('载入成功！');
        });
    });
};

ScenePanel.prototype.onLoadScene = function (obj) {
    if (obj.options) {
        Object.assign(this.app.options, obj.options);
    }

    if (obj.camera) {
        this.app.editor.camera.copy(obj.camera);

        this.app.editor.camera.children.forEach(n => {
            if (n instanceof THREE.AudioListener) {
                this.app.editor.camera.remove(n);
            }
        });

        var audioListener = obj.camera.children.filter(n => n instanceof THREE.AudioListener)[0];
        if (audioListener) {
            this.app.editor.audioListener = audioListener;
            this.app.editor.camera.add(audioListener);
        }
    }

    if (obj.renderer) {
        var viewport = this.app.viewport.container.dom;
        var oldRenderer = this.app.editor.renderer;

        viewport.removeChild(oldRenderer.domElement);
        viewport.appendChild(obj.renderer.domElement);
        this.app.editor.renderer = obj.renderer;
        this.app.editor.renderer.setSize(viewport.offsetWidth, viewport.offsetHeight);
        this.app.call('resize', this);
    }

    if (obj.scripts) {
        Object.assign(this.app.editor.scripts, obj.scripts);
    }

    if (obj.scene) {
        this.app.editor.setScene(obj.scene);
    }

    this.app.editor.camera.updateProjectionMatrix();

    this.app.call('sceneLoaded', this);
};

// ------------------------------- 保存场景 --------------------------------------

ScenePanel.prototype.onSave = function () {
    UI.msg('场景保存成功！');
};

// ------------------------------- 编辑场景 ---------------------------------------

ScenePanel.prototype.onEdit = function (data) {
    if (this.editWindow === undefined) {
        this.editWindow = new SceneEditWindow({
            app: this.app,
            parent: document.body,
            callback: this.update.bind(this)
        });
        this.editWindow.render();
    }
    this.editWindow.setData(data);
    this.editWindow.show();
};

// ------------------------------ 删除场景 ----------------------------------------

ScenePanel.prototype.onDelete = function (data) {
    var server = this.app.options.server;

    UI.confirm('询问', `是否删除场景${data.Name}？`, (event, btn) => {
        if (btn === 'ok') {
            Ajax.post(`${server}/api/Scene/Delete?ID=${data.ID}`, json => {
                var obj = JSON.parse(json);
                if (obj.Code === 200) {
                    this.update();
                }
                UI.msg(obj.Msg);
            });
        }
    });
};

export default ScenePanel;