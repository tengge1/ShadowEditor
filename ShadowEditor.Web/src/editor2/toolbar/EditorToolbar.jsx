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

        this.state = {
            mode: 'translate',
            isAddingPoint: false,
            isAddingLine: false,
            isAddingPolygon: false,
            isSpraying: false,
            isDigging: false,
        };

        this.handleEnterSelectMode = this.handleEnterSelectMode.bind(this);
        this.handleEnterTranslateMode = this.handleEnterTranslateMode.bind(this);
        this.handleEnterRotateMode = this.handleEnterRotateMode.bind(this);
        this.handleEnterScaleMode = this.handleEnterScaleMode.bind(this);
        this.handleAddPoint = this.handleAddPoint.bind(this);
        this.handleAddLine = this.handleAddLine.bind(this);
        this.handleAddPolygon = this.handleAddPolygon.bind(this);
        this.handleSpray = this.handleSpray.bind(this);
        this.handleDig = this.handleDig.bind(this);
    }

    render() {
        const { mode, isAddingPoint, isAddingLine, isAddingPolygon, isSpraying, isDigging } = this.state;

        return <Toolbar className={'EditorToolbar'} direction={'vertical'}>
            <IconButton
                icon={'select'}
                title={L_SELECT}
                selected={mode === 'select'}
                onClick={this.handleEnterSelectMode}></IconButton>
            <IconButton
                icon={'translate'}
                title={L_TRANSLATE}
                selected={mode === 'translate'}
                onClick={this.handleEnterTranslateMode}></IconButton>
            <IconButton
                icon={'rotate'}
                title={L_ROTATE}
                selected={mode === 'rotate'}
                onClick={this.handleEnterRotateMode}></IconButton>
            <IconButton
                icon={'scale'}
                title={L_SCALE}
                selected={mode === 'scale'}
                onClick={this.handleEnterScaleMode}></IconButton>
            <ToolbarSeparator />
            <IconButton
                icon={'point'}
                title={L_DRAW_POINT}
                selected={isAddingPoint}
                onClick={this.handleAddPoint}></IconButton>
            <IconButton
                icon={'line'}
                title={L_DRAW_LINE}
                selected={isAddingLine}
                onClick={this.handleAddLine}></IconButton>
            <IconButton
                icon={'polygon'}
                title={L_DRAW_POLYGON}
                selected={isAddingPolygon}
                onClick={this.handleAddPolygon}></IconButton>
            <IconButton
                icon={'spray'}
                title={L_SPRAY}
                selected={isSpraying}
                onClick={this.handleSpray}></IconButton>
            <IconButton
                icon={'texture'}
                title={L_DIG}
                selected={isDigging}
                onClick={this.handleDig}></IconButton>
        </Toolbar>;
    }

    // --------------------------------- 选择模式 -------------------------------------

    handleEnterSelectMode() {
        this.setState({ mode: 'select' });
        app.call('changeMode', this, 'select');
    }

    // -------------------------------- 平移模式 --------------------------------------

    handleEnterTranslateMode() {
        this.setState({ mode: 'translate' });
        app.call('changeMode', this, 'translate');
    }

    // -------------------------------- 旋转模式 ---------------------------------------

    handleEnterRotateMode() {
        this.setState({ mode: 'rotate' });
        app.call('changeMode', this, 'rotate');
    }

    // -------------------------------- 缩放模式 ---------------------------------------

    handleEnterScaleMode() {
        this.setState({ mode: 'scale' });
        app.call('changeMode', this, 'scale');
    }

    // --------------------------------- 画点 ------------------------------------------

    handleAddPoint() {
        const isAddingPoint = !this.state.isAddingPoint;

        this.setState({ isAddingPoint });

        if (isAddingPoint) {
            app.on(`intersect.EditorToolbarAddPoint`, this.onAddPointIntersect.bind(this));
        } else {
            app.on(`intersect.EditorToolbarAddPoint`, null);
        }
    }

    onAddPointIntersect(obj, event) {
        if (event.button !== 0) {
            return;
        }

        this.handleAddPoint();

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
        const isAddingLine = !this.state.isAddingLine;

        this.setState({ isAddingLine });

        if (isAddingLine) {
            app.on(`intersect.EditorToolbarAddLine`, this.onAddLineIntersect.bind(this));
            app.on(`dblclick.EditorToolbarAddLine`, this.onAddLineDblClick.bind(this));

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
            app.on(`intersect.EditorToolbarAddLine`, null);
            app.on(`dblclick.EditorToolbarAddLine`, null);

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
        const isAddingPolygon = !this.state.isAddingPolygon;

        this.setState({ isAddingPolygon });

        if (isAddingPolygon) {
            app.on(`intersect.EditorToolbarAddPolygon`, this.onAddPolygonIntersect.bind(this));
            app.on(`dblclick.EditorToolbarAddPolygon`, this.onAddPolygonDblClick.bind(this));

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
            app.on(`intersect.EditorToolbarAddPolygon`, null);
            app.on(`dblclick.EditorToolbarAddPolygon`, null);

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
        this.handleAddPolygon();
    }

    // -------------------------------- 贴花工具 ---------------------------------------

    handleSpray() {
        const isSpraying = !this.state.isSpraying;

        this.setState({ isSpraying });

        if (isSpraying) {
            app.on(`intersect.EditorToolbarSpray`, this.onSprayIntersect.bind(this));
        } else {
            app.on(`intersect.EditorToolbarSpray`, null);
        }
    }

    onSprayIntersect(obj, event) {
        if (event.button !== 0) {
            return;
        }

        this.handleSpray();

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

    handleDig() {
        this.setState({ isDigging: true, });

        if (this.digTool === undefined) {
            this.digTool = new DigTool(app);
            this.digTool.on(`end.EditorToolbar`, () => {
                this.setState({ isDigging: false, });
            });
        }

        this.digTool.start();
    }
}

export default EditorToolbar;