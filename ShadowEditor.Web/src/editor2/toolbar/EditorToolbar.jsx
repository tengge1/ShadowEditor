import './css/EditorToolbar.css';
import { classNames, PropTypes, Toolbar, ToolbarSeparator, IconButton } from '../../third_party';
import AddObjectCommand from '../../command/AddObjectCommand';
import Earcut from '../../utils/Earcut';

import DigTool from '../../tool/DigTool';

/**
 * 编辑器工具栏
 * @author tengge / https://github.com/tengge1
 */
class EditorToolbar extends React.Component {
    constructor(props) {
        super(props);

        this.handleEnterSelectMode = this.handleEnterSelectMode.bind(this);
        this.handleEnterTranslateMode = this.handleEnterTranslateMode.bind(this);
        this.handleEnterRotateMode = this.handleEnterRotateMode.bind(this);
        this.handleEnterScaleMode = this.handleEnterScaleMode.bind(this);
        this.handleAddPoint = this.handleAddPoint.bind(this);
        this.handleAddLine = this.handleAddLine.bind(this);
        this.handleAddPolygon = this.handleAddPolygon.bind(this);
        this.handleSpray = this.handleSpray.bind(this);
    }

    render() {
        return <Toolbar className={'EditorToolbar'} direction={'vertical'}>
            <IconButton icon={'select'} selected={true} onClick={this.handleEnterSelectMode}></IconButton>
            <IconButton icon={'translate'} onClick={this.handleEnterTranslateMode}></IconButton>
            <IconButton icon={'rotate'} onClick={this.handleEnterRotateMode}></IconButton>
            <IconButton icon={'scale'} onClick={this.handleEnterScaleMode}></IconButton>
            <ToolbarSeparator />
            <IconButton icon={'point'} onClick={this.handleAddPoint}></IconButton>
            <IconButton icon={'line'} onClick={this.handleAddLine}></IconButton>
            <IconButton icon={'spray'} onClick={this.handleAddPolygon}></IconButton>
            <IconButton icon={'texture'} onClick={this.handleSpray}></IconButton>
        </Toolbar>;
    }

    componentDidMount() {
        // app.on(`changeMode.${this.id}`, this.onChangeMode.bind(this));
    }

    // --------------------------------- 选择模式 -------------------------------------

    handleEnterSelectMode() {
        app.call('changeMode', this, 'select');
    }

    // -------------------------------- 平移模式 --------------------------------------

    handleEnterTranslateMode() {
        app.call('changeMode', this, 'translate');
    }

    // -------------------------------- 旋转模式 ---------------------------------------

    handleEnterRotateMode() {
        app.call('changeMode', this, 'rotate');
    }

    // -------------------------------- 缩放模式 ---------------------------------------

    handleEnterScaleMode() {
        app.call('changeMode', this, 'scale');
    }

    // ------------------------------ 模式改变事件 -------------------------------------

    onChangeMode(mode) {
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
    }

    // --------------------------------- 画点 ------------------------------------------

    handleAddPoint() {
        this.isAddingPoint = !this.isAddingPoint;

        var addPointBtn = UI.get('addPointBtn', this.id);

        if (this.isAddingPoint) {
            addPointBtn.select();
            app.on(`intersect.${this.id}AddPoint`, this.onAddPointIntersect.bind(this));
        } else {
            addPointBtn.unselect();
            app.on(`intersect.${this.id}AddPoint`, null);
        }
    }

    onAddPointIntersect(obj, event) {
        if (event.button !== 0) {
            return;
        }

        this.onAddPoint();

        var geometry = new THREE.CircleBufferGeometry(0.4, 32, 0, Math.PI * 2);

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

        mesh.name = L_POINT;

        app.editor.execute(new AddObjectCommand(mesh));
    }

    // ---------------------------------- 画线 -----------------------------------------

    handleAddLine() {
        if (this.hasLoadLineScript === undefined) {
            this.hasLoadLineScript = true;
            app.require('line').then(() => {
                this.onAddLine();
            });
        } else {
            this.onAddLine();
        }
    }

    onAddLine() {
        this.isAddingLine = !this.isAddingLine;

        var addLineBtn = UI.get('addLineBtn', this.id);

        if (this.isAddingLine) {
            addLineBtn.select();
            app.on(`intersect.${this.id}AddLine`, this.onAddLineIntersect.bind(this));
            app.on(`dblclick.${this.id}AddLine`, this.onAddLineDblClick.bind(this));

            this.linePositions = [];
            this.lineColors = [];

            var geometry = new THREE.LineGeometry();

            var material = new THREE.LineMaterial({
                color: 0xffffff,
                linewidth: 8, // in pixels
                vertexColors: THREE.VertexColors,
                dashed: false,
                polygonOffset: true,
                polygonOffsetFactor: -40,
            });

            var renderer = app.editor.renderer;
            material.resolution.set(renderer.domElement.clientWidth, renderer.domElement.clientHeight);

            this.line = new THREE.Line2(geometry, material);
            this.line.name = L_LINE;

            app.editor.execute(new AddObjectCommand(this.line));
        } else {
            addLineBtn.unselect();
            app.on(`intersect.${this.id}AddLine`, null);
            app.on(`dblclick.${this.id}AddLine`, null);

            this.linePositions = null;
            this.lineColors = null;
            this.line = null;
        }
    }

    onAddLineIntersect(obj, event) {
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

        geometry.maxInstancedCount = this.linePositions.length / 3 - 1;

        this.line.computeLineDistances();
    }

    onAddLineDblClick(obj) {
        this.onAddLine();
    }

    // ---------------------------------- 画面 ------------------------------------------

    handleAddPolygon() {
        this.isAddingPolygon = !this.isAddingPolygon;

        var addPolygonBtn = UI.get('addPolygonBtn', this.id);

        if (this.isAddingPolygon) {
            addPolygonBtn.select();
            app.on(`intersect.${this.id}AddPolygon`, this.onAddPolygonIntersect.bind(this));
            app.on(`dblclick.${this.id}AddPolygon`, this.onAddPolygonDblClick.bind(this));

            var geometry = new THREE.BufferGeometry();

            geometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(300), 3));
            geometry.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(300), 3));
            geometry.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(200), 2));

            geometry.attributes.position.count = 0;
            geometry.attributes.normal.count = 0;
            geometry.attributes.uv.count = 0;

            var material = new THREE.MeshBasicMaterial({
                color: 0xffffff * Math.random(),
                polygonOffset: true,
                polygonOffsetFactor: -40,
                side: THREE.DoubleSide,
            });

            this.polygon = new THREE.Mesh(geometry, material);

            this.polygon.name = L_POLYGON;
            this.polygon.drawMode = THREE.TriangleStripDrawMode;

            app.editor.execute(new AddObjectCommand(this.polygon));

            this.polygonPoints = [];
        } else {
            addPolygonBtn.unselect();
            app.on(`intersect.${this.id}AddPolygon`, null);
            app.on(`dblclick.${this.id}AddPolygon`, null);

            this.polygon = null;

            this.polygonPoints = null;
        }
    }

    onAddPolygonIntersect(obj) {
        if (event.button !== 0) {
            return;
        }

        this.polygonPoints.push(obj.point);

        var position = this.polygon.geometry.attributes.position;
        var normal = this.polygon.geometry.attributes.normal;
        var uv = this.polygon.geometry.attributes.uv;

        var index = position.count;

        position.setXYZ(
            index,
            obj.point.x,
            obj.point.y,
            obj.point.z,
        );

        normal.setXYZ(index, obj.face.normal.x, obj.face.normal.y, obj.face.normal.z);

        uv.setXY(index, obj.uv.x, obj.uv.y);

        position.count++;
        normal.count++;
        uv.count++;

        position.needsUpdate = true;
        normal.needsUpdate = true;
        uv.needsUpdate = true;
    }

    onAddPolygonDblClick(obj) {
        this.onAddPolygon();
    }

    // -------------------------------- 贴花工具 ---------------------------------------

    handleSpray() {
        this.isSpraying = !this.isSpraying;

        var sprayBtn = UI.get('sprayBtn', this.id);

        if (this.isSpraying) {
            sprayBtn.select();
            app.on(`intersect.${this.id}Spray`, this.onSprayIntersect.bind(this));
        } else {
            sprayBtn.unselect();
            app.on(`intersect.${this.id}Spray`, null);
        }
    }

    onSprayIntersect(obj, event) {
        if (event.button !== 0) {
            return;
        }

        this.onSpray();

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

        decal.name = L_DECAL;

        app.editor.execute(new AddObjectCommand(decal));
    }

    // ------------------------------- 挖坑工具 -------------------------------------

    onDig() {
        var digBtn = UI.get('digBtn', this.id);
        digBtn.select();

        if (this.digTool === undefined) {
            this.digTool = new DigTool(app);
            this.digTool.on(`end.${this.id}`, () => {
                digBtn.unselect();
            });
        }

        this.digTool.start();
    }
}

export default EditorToolbar;