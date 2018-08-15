import UI from '../../ui/UI';
import Ajax from '../../utils/Ajax';
import AddObjectCommand from '../../command/AddObjectCommand';
import UploadUtils from '../../utils/UploadUtils';

/**
 * 模型窗口
 * @param {*} options 
 */
function ModelWindow(options) {
    UI.Control.call(this, options);
    this.app = options.app;
    this.models = [];
    this.keyword = '';
}

ModelWindow.prototype = Object.create(UI.Control.prototype);
ModelWindow.prototype.constructor = ModelWindow;

ModelWindow.prototype.render = function () {
    var _this = this;

    var container = UI.create({
        xtype: 'window',
        id: 'modelWindow',
        parent: this.app.container,
        title: '模型列表',
        width: '700px',
        height: '500px',
        bodyStyle: {
            paddingTop: 0
        },
        shade: false,
        children: [{
            xtype: 'row',
            style: {
                position: 'sticky',
                top: '0',
                padding: '2px',
                backgroundColor: '#eee',
                borderBottom: '1px solid #ddd',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
            },
            children: [{
                xtype: 'button',
                text: '上传模型',
                onClick: this.onAddFile.bind(this)
            }, {
                xtype: 'button',
                text: '编辑分组'
            }, {
                xtype: 'toolbarfiller'
            }, {
                xtype: 'searchfield',
                showSearchButton: false,
                showResetButton: true,
                onInput: function () {
                    _this.onSearch(this.getValue());
                }
            }]
        }, {
            xtype: 'row',
            children: [{
                xtype: 'imagelist',
                id: 'modelWindowImages',
                style: {
                    width: '100%',
                    height: '100%',
                },
                onClick: function (event, index, btn) {
                    _this.onClickImage(this, index, btn);
                }
            }]
        }]
    });
    container.render();
};

/**
 * 显示模型文件列表
 */
ModelWindow.prototype.show = function () {
    UI.get('modelWindow').show();

    this.keyword = '';
    this.updateModelList();
};

ModelWindow.prototype.updateModelList = function () {
    var app = this.app;
    var server = app.options.server;

    Ajax.getJson(`${server}/api/Mesh/List`, (obj) => {
        this.models = obj.Data;
        this.onSearch(this.keyword);
    });
};

/**
 * 搜索模型文件
 * @param {*} name 
 */
ModelWindow.prototype.onSearch = function (name) {
    if (name.trim() === '') {
        this.renderImages(this.models);
        return;
    }

    name = name.toLowerCase();

    var models = this.models.filter((n) => {
        return n.Name.indexOf(name) > -1 ||
            n.FirstPinYin.indexOf(name) > -1 ||
            n.TotalPinYin.indexOf(name) > -1;
    });
    this.renderImages(models);
};

ModelWindow.prototype.renderImages = function (models) {
    var images = UI.get('modelWindowImages');
    images.clear();

    images.children = models.map((n) => {
        return {
            xtype: 'image',
            src: n.Image == null ? null : (server + n.Image),
            title: n.Name,
            data: n,
            icon: 'icon-model',
            cornerText: n.Type,
            style: {
                backgroundColor: '#eee'
            }
        };
    });;

    images.render();
};

ModelWindow.prototype.onAddFile = function () {
    var input = document.getElementById('modelWindowFileInput');
    if (input == null) {
        input = document.createElement('input');
        input.id = 'modelWindowFileInput';
        input.type = 'file';
        document.body.appendChild(input);
        input.onchange = this.onUploadFile.bind(this);
    }
    input.click();
};

ModelWindow.prototype.onUploadFile = function (event) {
    UploadUtils.upload('modelWindowFileInput', `${this.app.options.server}/api/Mesh/Add`, (e) => {
        document.getElementById('modelWindowFileInput').value = null;
        if (e.target.status === 200) {
            var obj = JSON.parse(e.target.responseText);
            if (obj.Code === 200) {
                this.updateModelList();
            }
            UI.msg(obj.Msg);
        } else {
            UI.msg('服务器错误！');
        }
    });
};

ModelWindow.prototype.onClickImage = function (imgs, index, btn) {
    var model = imgs.children[index].data;

    if (btn === 'edit') { // 编辑模型
        UI.msg('开始编辑模型');
        return;
    }

    if (btn === 'delete') { // 删除模型
        UI.msg('开始删除模型');
        return;
    }

    // 添加模型
    if (model.Type === 'amf') {
        var loader = new THREE.AMFLoader();
        loader.load(this.app.options.server + model.Url, (group) => {
            group.name = model.Name;
            group.rotation.x = -Math.PI / 2;

            Object.assign(group.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(group);
            cmd.execute();
        });
    } else if (model.Type === 'binary') {
        var loader = new THREE.BinaryLoader();

        loader.load(this.app.options.server + model.Url, (geometry, materials) => {
            var mesh = new THREE.Mesh(geometry, materials);
            mesh.name = model.Name;
            mesh.rotation.x = -Math.PI / 2;

            Object.assign(mesh.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(mesh);
            cmd.execute();
        });
    } else if (model.Type === 'awd') {
        var loader = new THREE.AWDLoader();

        loader.load(this.app.options.server + model.Url, (obj3d) => {
            obj3d.name = model.Name;
            obj3d.rotation.x = -Math.PI / 2;

            Object.assign(obj3d.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(obj3d);
            cmd.execute();
        });
    } else if (model.Type === 'babylon') {
        var loader = new THREE.BabylonLoader();

        loader.load(this.app.options.server + model.Url, (scene) => {
            var obj3d = new THREE.Object3D();
            obj3d.name = model.Name;
            obj3d.rotation.x = -Math.PI / 2;

            Object.assign(obj3d.userData, model, {
                Server: true
            });

            obj3d.children = scene.children;

            var cmd = new AddObjectCommand(obj3d);
            cmd.execute();
        });
    } else if (model.Type === 'ctm') {
        var loader = new THREE.CTMLoader();

        loader.load(this.app.options.server + model.Url, (geometry) => {
            var material = new THREE.MeshStandardMaterial();
            var mesh = new THREE.Mesh(geometry, material);
            mesh.name = model.Name;
            mesh.rotation.x = -Math.PI / 2;

            Object.assign(mesh.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(mesh);
            cmd.execute();
        });
    } else if (model.Type === 'dae') {
        var loader = new THREE.ColladaLoader();

        loader.load(this.app.options.server + model.Url, (collada) => {
            var obj3d = collada.scene;
            obj3d.name = model.Name;
            obj3d.rotation.x = -Math.PI / 2;

            Object.assign(obj3d.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(obj3d);
            cmd.execute();
        });
    } else if (model.Type === 'fbx') {
        var loader = new THREE.FBXLoader();

        loader.load(this.app.options.server + model.Url, (obj3d) => {
            obj3d.name = model.Name;
            obj3d.rotation.x = -Math.PI / 2;

            Object.assign(obj3d.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(obj3d);
            cmd.execute();
        });
    } else if (model.Type === 'glb' || model.Type === 'gltf') {
        var loader = new THREE.GLTFLoader();

        loader.load(this.app.options.server + model.Url, (result) => {
            var obj3d = result.scene;
            obj3d.name = model.Name;
            obj3d.rotation.x = -Math.PI / 2;

            Object.assign(obj3d.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(obj3d);
            cmd.execute();
        });
    } else if (model.Type === 'kmz') {
        var loader = new THREE.KMZLoader();

        loader.load(this.app.options.server + model.Url, (collada) => {
            var obj3d = collada.scene;
            obj3d.name = model.Name;
            obj3d.rotation.x = -Math.PI / 2;

            Object.assign(obj3d.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(obj3d);
            cmd.execute();
        });
    } else if (model.Type === 'ply') {
        var loader = new THREE.PLYLoader();

        loader.load(this.app.options.server + model.Url, (geometry) => {
            var material = new THREE.MeshStandardMaterial();
            var mesh = new THREE.Mesh(geometry, material);
            mesh.name = model.Name;
            mesh.rotation.x = -Math.PI / 2;

            Object.assign(mesh.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(mesh);
            cmd.execute();
        });
    } else if (model.Type === 'obj') {
        var loader = new THREE.OBJLoader();

        loader.load(this.app.options.server + model.Url, (obj) => {
            obj.name = model.Name;
            obj.rotation.x = -Math.PI / 2;

            Object.assign(obj.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(obj);
            cmd.execute();
        });
    } else if (model.Type === 'md2') {
        var loader = new THREE.MD2Loader();

        loader.load(this.app.options.server + model.Url, (geometry) => {
            var material = new THREE.MeshStandardMaterial({
                morphTargets: true,
                morphNormals: true
            });

            var mesh = new THREE.Mesh(geometry, material);
            mesh.mixer = new THREE.AnimationMixer(mesh);

            mesh.name = model.Name;
            mesh.rotation.x = -Math.PI / 2;

            Object.assign(mesh.userData, model, {
                Server: true
            });

            var cmd = new AddObjectCommand(mesh);
            cmd.execute();
        });
    } else {
        console.warn(`ModelWindow: 未知模型类型${model.Type}`);
    }
};

export default ModelWindow;