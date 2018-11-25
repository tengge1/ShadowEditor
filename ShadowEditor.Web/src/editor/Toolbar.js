import UI from '../ui/UI';
import AddObjectCommand from '../command/AddObjectCommand';

/**
 * 工具栏
 * @author tengge / https://github.com/tengge1
 */
function Toolbar(options) {
    UI.Control.call(this, options);
    this.app = options.app;

    this.isAddingPoint = false;
    this.isAddingLine = false;
    this.isAddingPolygon = false;
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
            id: 'addPointBtn',
            scope: this.id,
            icon: 'icon-point',
            title: '画点',
            onClick: this.onAddPoint.bind(this)
        }, {
            xtype: 'iconbutton',
            id: 'addLineBtn',
            scope: this.id,
            icon: 'icon-line',
            title: '画线',
            onClick: this.onAddLine.bind(this)
        }, {
            xtype: 'iconbutton',
            id: 'addPolygonBtn',
            scope: this.id,
            icon: 'icon-polygon',
            title: '画面',
            onClick: this.onAddPolygon.bind(this)
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

// --------------------------------- 画点 ------------------------------------------

Toolbar.prototype.onAddPoint = function () {
    this.isAddingPoint = !this.isAddingPoint;

    var addPointBtn = UI.get('addPointBtn', this.id);

    if (this.isAddingPoint) {
        addPointBtn.select();
        this.app.on(`intersect.${this.id}AddPoint`, this.onAddPointIntersect.bind(this));
    } else {
        addPointBtn.unselect();
        this.app.on(`intersect.${this.id}AddPoint`, null);
    }
};

Toolbar.prototype.onAddPointIntersect = function (obj, event) {
    if (event.button !== 0) {
        return;
    }

    var geometry = new THREE.CircleBufferGeometry(0.5, 32, 0, Math.PI * 2);

    var material = new THREE.PointsMaterial({
        color: 0xffffff * Math.random(),
        polygonOffset: true,
        polygonOffsetFactor: -40,
    });

    var mesh = new THREE.Mesh(geometry, material);

    mesh.position.copy(obj.point);

    var normal = obj.face.normal.clone();
    normal.transformDirection(obj.object.matrixWorld);

    mesh.lookAt(new THREE.Vector3().addVectors(obj.point, normal));

    mesh.name = '点';

    this.app.editor.execute(new AddObjectCommand(mesh));
};

// ---------------------------------- 画线 -----------------------------------------

Toolbar.prototype.onAddLine = function () {
    this.isAddingLine = !this.isAddingLine;

    var addLineBtn = UI.get('addLineBtn', this.id);

    if (this.isAddingLine) {
        addLineBtn.select();
        this.app.on(`intersect.${this.id}AddLine`, this.onAddLineIntersect.bind(this));
        this.app.on(`dblclick.${this.id}AddLine`, this.onAddLineDblClick.bind(this));

        this.linePositions = [];
        this.lineColors = [];

        var geometry = new THREE.LineGeometry();

        geometry.setPositions([
            0, 0, 0, 10, 20, 30
        ]);

        geometry.setColors([
            0.9, 0, 0,
            0, 0.9, 0
        ]);

        var material = new THREE.LineMaterial({
            color: 0xffffff,
            linewidth: 5, // in pixels
            vertexColors: THREE.VertexColors,
            dashed: false,
            polygonOffset: true,
            polygonOffsetFactor: -40,
        });

        this.line = new THREE.Line2(geometry, material);

        this.line.name = '线';

        this.line.computeLineDistances();
        this.line.scale.set(1, 1, 1);

        this.app.editor.execute(new AddObjectCommand(this.line));
    } else {
        addLineBtn.unselect();
        this.app.on(`intersect.${this.id}AddLine`, null);
        this.app.on(`dblclick.${this.id}AddLine`, null);

        this.line = null;
    }
};

Toolbar.prototype.onAddLineIntersect = function (obj, event) { // 向线添加顶点
    if (event.button !== 0) {
        return;
    }

    this.linePositions.push(obj.point.x, obj.point.y, obj.point.z);

    var color = new THREE.Color(0xffffff * Math.random());
    this.lineColors.push(color.r, color.g, color.b);

    if (this.linePositions.length < 6) {
        return;
    }

    var geometry = this.line.geometry;
    geometry.setPositions(this.linePositions);
    geometry.setColors(this.lineColors);

    this.line.computeLineDistances();
    this.line.scale.set(1, 1, 1);
};

Toolbar.prototype.onAddLineDblClick = function (obj) { // 停止画线，并开始绘制新的一条线
    this.isAddingLine = !this.isAddingLine;
    this.onAddLine();
};

// ---------------------------------- 画面 ------------------------------------------

Toolbar.prototype.onAddPolygon = function () {
    this.isAddingPolygon = !this.isAddingPolygon;

    var addPolygonBtn = UI.get('addPolygonBtn', this.id);

    if (this.isAddingPolygon) {
        addPolygonBtn.select();
        this.app.on(`intersect.${this.id}AddPolygon`, this.onAddPolygonIntersect.bind(this));
        this.app.on(`dblclick.${this.id}AddPolygon`, this.onAddPolygonDblClick.bind(this));

        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(300), 3));
        geometry.attributes.position.count = 0

        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff * Math.random(),
            polygonOffset: true,
            polygonOffsetFactor: -40,
        });

        this.line = new THREE.Line(geometry, material);

        this.line.name = '线';

        this.app.editor.execute(new AddObjectCommand(this.line));
    } else {
        addPolygonBtn.unselect();
        this.app.on(`intersect.${this.id}AddPolygon`, null);
        this.app.on(`dblclick.${this.id}AddPolygon`, null);

        this.line = null;
    }
};

Toolbar.prototype.onAddPolygonIntersect = function (obj) {
    if (event.button !== 0) {
        return;
    }

    var position = this.line.geometry.attributes.position;

    position.setXYZ(position.count, obj.point.x, obj.point.y, obj.point.z);

    position.count++;

    position.needsUpdate = true;
};

Toolbar.prototype.onAddPolygonDblClick = function (obj) { // 停止画线，并开始绘制新的一条线
    this.isAddingLine = !this.isAddingLine;
    this.onAddLine();
};

// -------------------------------- 贴花工具 ---------------------------------------

Toolbar.prototype.onSpray = function () {
    this.isSpraying = !this.isSpraying;

    var sprayBtn = UI.get('sprayBtn', this.id);

    if (this.isSpraying) {
        sprayBtn.select();
        this.app.on(`intersect.${this.id}Spray`, this.onSprayIntersect.bind(this));
    } else {
        sprayBtn.unselect();
        this.app.on(`intersect.${this.id}Spray`, null);
    }
};

Toolbar.prototype.onSprayIntersect = function (obj, event) {
    if (event.button !== 0) {
        return;
    }

    var mesh = obj.object;
    var position = obj.point;

    if (mesh instanceof THREE.Points) {
        return;
    }

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
            polygonOffsetFactor: -4,
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