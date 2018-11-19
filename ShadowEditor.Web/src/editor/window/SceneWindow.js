import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import AddObjectCommand from '../../command/AddObjectCommand';
import UploadUtils from '../../utils/UploadUtils';
import Converter from '../../serialization/Converter';
import AnimationGroup from '../../animation/AnimationGroup';
import Animation from '../../animation/Animation';
import SceneEditWindow from './SceneEditWindow';

/**
 * 场景窗口
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function SceneWindow(options) {
    UI.ImageListWindow.call(this, options);
    this.app = options.app;

    this.title = '场景列表';
    this.imageIcon = 'icon-scenes';
    this.preImageUrl = this.app.options.server;
}

SceneWindow.prototype = Object.create(UI.ImageListWindow.prototype);
SceneWindow.prototype.constructor = SceneWindow;

SceneWindow.prototype.beforeUpdateList = function () {
    var server = this.app.options.server;

    return new Promise(resolve => {
        Ajax.getJson(`${server}/api/Scene/List`, obj => {
            resolve(obj.Data);
        });
    });
};

SceneWindow.prototype.onClick = function (data) {
    var app = this.app;
    var editor = app.editor;
    var server = app.options.server;
    document.title = data.Name;

    Ajax.get(`${server}/api/Scene/Load?ID=${data.ID}`, (json) => {
        var obj = JSON.parse(json);
        if (obj.Code === 200) {
            this.hide();
        }

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

SceneWindow.prototype.onLoadScene = function (obj) {
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

SceneWindow.prototype.onEdit = function (data) {
    if (this.editWindow === undefined) {
        this.editWindow = new SceneEditWindow({
            app: this.app,
            parent: this.parent,
            callback: this.update.bind(this)
        });
        this.editWindow.render();
    }
    this.editWindow.setData(data);
    this.editWindow.show();
};

SceneWindow.prototype.onDelete = function (data) {
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

export default SceneWindow;