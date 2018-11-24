import UI from '../ui/UI';
import AddObjectCommand from '../command/AddObjectCommand';

/**
 * 工具栏
 * @author tengge / https://github.com/tengge1
 */
function Toolbar(options) {
    UI.Control.call(this, options);
    this.app = options.app;

    this.isSpraying = false;
};

Toolbar.prototype = Object.create(UI.Control.prototype);
Toolbar.prototype.constructor = Toolbar;

Toolbar.prototype.render = function () {
    var _this = this;

    var data = {
        xtype: 'div',
        parent: this.parent,
        cls: 'toolbar',
        children: [{
            xtype: 'iconbutton',
            id: 'selectBtn',
            scope: this.id,
            icon: 'icon-select',
            title: '选择',
            onClick: this.enterSelectMode.bind(this)
        }, {
            xtype: 'iconbutton',
            id: 'translateBtn',
            scope: this.id,
            icon: 'icon-translate',
            cls: 'Button IconButton selected',
            title: '平移(W)',
            onClick: this.enterTranslateMode.bind(this)
        }, {
            xtype: 'iconbutton',
            id: 'rotateBtn',
            scope: this.id,
            icon: 'icon-rotate',
            title: '旋转(E)',
            onClick: this.enterRotateMode.bind(this)
        }, {
            xtype: 'iconbutton',
            id: 'scaleBtn',
            scope: this.id,
            icon: 'icon-scale',
            title: '缩放(R)',
            onClick: this.enterScaleMode.bind(this)
        }, {
            xtype: 'hr'
        }, {
            xtype: 'iconbutton',
            id: 'sprayBtn',
            scope: this.id,
            icon: 'icon-spray',
            title: '贴花',
            onClick: this.onSpray.bind(this)
        }]
    };

    var control = UI.create(data);
    control.render();

    this.app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
};

// --------------------------------- 选择模式 -------------------------------------

Toolbar.prototype.enterSelectMode = function () {
    this.app.call('changeMode', this, 'select');
};

// -------------------------------- 平移模式 --------------------------------------

Toolbar.prototype.enterTranslateMode = function () {
    this.app.call('changeMode', this, 'translate');
};

// -------------------------------- 旋转模式 ---------------------------------------

Toolbar.prototype.enterRotateMode = function () {
    this.app.call('changeMode', this, 'rotate');
};

// -------------------------------- 缩放模式 ---------------------------------------

Toolbar.prototype.enterScaleMode = function () {
    this.app.call('changeMode', this, 'scale');
};

// ------------------------------ 模式改变事件 -------------------------------------

Toolbar.prototype.onChangeMode = function (mode) {
    var selectBtn = UI.get('selectBtn', this.id);
    var translateBtn = UI.get('translateBtn', this.id);
    var rotateBtn = UI.get('rotateBtn', this.id);
    var scaleBtn = UI.get('scaleBtn', this.id);

    selectBtn.unselect();
    translateBtn.unselect();
    rotateBtn.unselect();
    scaleBtn.unselect();

    switch (mode) {
        case 'select':
            selectBtn.select();
            break;
        case 'translate':
            translateBtn.select();
            break;
        case 'rotate':
            rotateBtn.select();
            break;
        case 'scale':
            scaleBtn.select();
            break;
    }
};

// -------------------------------- 喷水工具 ---------------------------------------

Toolbar.prototype.onSpray = function () {
    this.isSpraying = !this.isSpraying;

    var sprayBtn = UI.get('sprayBtn', this.id);

    if (this.isSpraying) {
        sprayBtn.select();
        this.app.on(`intersect.${this.id}Spray`, this.onIntersect.bind(this));
    } else {
        sprayBtn.unselect();
        this.app.on(`intersect.${this.id}Spray`, null);
    }
};

Toolbar.prototype.onIntersect = function (obj) {
    var mesh = obj.object;
    var position = obj.point;

    var normal = obj.face.normal.clone();
    normal.transformDirection(obj.object.matrixWorld);

    var mat = new THREE.Matrix4();
    mat.lookAt(position, new THREE.Vector3().addVectors(position, normal), mesh.up);

    var orientation = new THREE.Euler();
    orientation.setFromRotationMatrix(mat);

    var size = new THREE.Vector3(1, 1, 1).multiplyScalar(10 + Math.random() * 10);

    if (this.decalMaterial === undefined) {
        var textureLoader = new THREE.TextureLoader();

        var decalDiffuse = textureLoader.load('assets/textures/decal/decal-diffuse.png');
        var decalNormal = textureLoader.load('assets/textures/decal/decal-normal.jpg');

        this.decalMaterial = new THREE.MeshPhongMaterial({
            specular: 0x444444,
            map: decalDiffuse,
            normalMap: decalNormal,
            normalScale: new THREE.Vector2(1, 1),
            shininess: 30,
            transparent: true,
            depthTest: true,
            depthWrite: false,
            polygonOffset: true,
            polygonOffsetFactor: - 4,
            wireframe: false
        });
    }

    var material = this.decalMaterial.clone();
    material.color.setHex(Math.random() * 0xffffff);

    var decal = new THREE.Mesh(new THREE.DecalGeometry(mesh, position, orientation, size), material);

    decal.name = '贴花';

    this.app.editor.execute(new AddObjectCommand(decal));
};

export default Toolbar;