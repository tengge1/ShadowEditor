import './css/EditorToolbar.css';
import { Toolbar, ToolbarSeparator, IconButton, ImageButton, Select } from '../../third_party';
import AddObjectCommand from '../../command/AddObjectCommand';
import DigTool from '../../tool/DigTool';

/**
 * 编辑器工具栏
 * @author tengge / https://github.com/tengge1
 */
class EditorToolbar extends React.Component {
    constructor(props) {
        super(props);

        this.toolbars = {
            general: _t('General Tools'),
            edit: _t('Edit Tools'),
            terrain: _t('Terrain Tools')
        };

        this.state = {
            toolbar: 'general',
            mode: 'translate',
            isAddingPoint: false,
            isAddingLine: false,
            isAddingPolygon: false,
            isSpraying: false,
            isDigging: false,
            view: 'perspective',
            isGridMode: false
        };

        this.handleChangeToolbar = this.handleChangeToolbar.bind(this);

        this.handleEnterSelectMode = this.handleEnterSelectMode.bind(this);
        this.handleEnterTranslateMode = this.handleEnterTranslateMode.bind(this);
        this.handleEnterRotateMode = this.handleEnterRotateMode.bind(this);
        this.handleEnterScaleMode = this.handleEnterScaleMode.bind(this);

        this.handleAddPoint = this.handleAddPoint.bind(this);
        this.handleAddLine = this.handleAddLine.bind(this);
        this.handleAddPolygon = this.handleAddPolygon.bind(this);
        this.handleSpray = this.handleSpray.bind(this);
        this.handleDig = this.handleDig.bind(this);

        this.handlePerspective = this.handlePerspective.bind(this);
        this.handleFrontView = this.handleFrontView.bind(this);
        this.handleSideView = this.handleSideView.bind(this);
        this.handleTopView = this.handleTopView.bind(this);
        this.handleGridMode = this.handleGridMode.bind(this);
    }

    render() {
        const { toolbar, mode, isAddingPoint, isAddingLine, isAddingPolygon, isSpraying, isDigging, view, isGridMode } = this.state;

        return <Toolbar className={'EditorToolbar'}
            direction={'horizontal'}
               >
            <Select options={this.toolbars}
                name={'toolbar'}
                value={toolbar}
                onChange={this.handleChangeToolbar}
            />
            <ToolbarSeparator />
            <IconButton
                icon={'select'}
                title={_t('Select')}
                selected={mode === 'select'}
                onClick={this.handleEnterSelectMode}
            />
            <IconButton
                icon={'translate'}
                title={_t('Translate')}
                selected={mode === 'translate'}
                onClick={this.handleEnterTranslateMode}
            />
            <IconButton
                icon={'rotate'}
                title={_t('Rotate')}
                selected={mode === 'rotate'}
                onClick={this.handleEnterRotateMode}
            />
            <IconButton
                icon={'scale'}
                title={_t('Scale')}
                selected={mode === 'scale'}
                onClick={this.handleEnterScaleMode}
            />
            <ToolbarSeparator />
            <IconButton
                icon={'point'}
                title={_t('Draw Point')}
                selected={isAddingPoint}
                onClick={this.handleAddPoint}
            />
            <IconButton
                icon={'line'}
                title={_t('Draw Line')}
                selected={isAddingLine}
                onClick={this.handleAddLine}
            />
            <IconButton
                icon={'polygon'}
                title={_t('Draw Pologon')}
                selected={isAddingPolygon}
                onClick={this.handleAddPolygon}
            />
            <IconButton
                icon={'spray'}
                title={_t('Spray')}
                selected={isSpraying}
                onClick={this.handleSpray}
            />
            <IconButton
                icon={'texture'}
                title={_t('Dig')}
                show={false}
                selected={isDigging}
                onClick={this.handleDig}
            />
            <ToolbarSeparator />
            <ImageButton
                src={'assets/image/perspective-view.png'}
                title={_t('Perspective View')}
                selected={view === 'perspective'}
                onClick={this.handlePerspective}
            />
            <ImageButton
                src={'assets/image/front-view.png'}
                title={_t('Front View')}
                selected={view === 'front'}
                onClick={this.handleFrontView}
            />
            <ImageButton
                src={'assets/image/side-view.png'}
                title={_t('Side View')}
                selected={view === 'side'}
                onClick={this.handleSideView}
            />
            <ImageButton
                src={'assets/image/top-view.png'}
                title={_t('Top View')}
                selected={view === 'top'}
                onClick={this.handleTopView}
            />
            <IconButton
                icon={'grid'}
                title={_t('Grid Mode')}
                selected={isGridMode}
                onClick={this.handleGridMode}
            />
        </Toolbar>;
    }

    // ------------------------------ 选择工具栏 -------------------------------------

    handleChangeToolbar(value, name) {
        this.setState({
            [name]: value
        });
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
            polygonOffsetFactor: -40
        });

        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.copy(obj.point);

        var normal = obj.face.normal.clone();
        normal.transformDirection(obj.object.matrixWorld);

        mesh.lookAt(new THREE.Vector3().addVectors(obj.point, normal));

        mesh.name = _t('Point');

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
                polygonOffsetFactor: -40
            });

            var renderer = app.editor.renderer;
            material.resolution.set(renderer.domElement.clientWidth, renderer.domElement.clientHeight);

            this.line = new THREE.Line2(geometry, material);
            this.line.name = _t('Line');

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

    onAddLineDblClick() {
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
                side: THREE.DoubleSide
            });

            this.polygon = new THREE.Mesh(geometry, material);

            this.polygon.name = _t('Polygon');
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
            obj.point.z
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

    onAddPolygonDblClick() {
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

        decal.name = _t('Decal');

        app.editor.execute(new AddObjectCommand(decal));
    }

    // ------------------------------- 挖坑工具 -------------------------------------

    handleDig() {
        this.setState({ isDigging: true });

        if (this.digTool === undefined) {
            this.digTool = new DigTool(app);
            this.digTool.on(`end.EditorToolbar`, () => {
                this.setState({ isDigging: false });
            });
        }

        this.digTool.start();
    }

    // ------------------------------ 视角工具 ------------------------------------------

    handlePerspective() {
        app.call(`changeView`, this, 'perspective');
        this.setState({
            view: 'perspective'
        });
    }

    handleFrontView() {
        app.call(`changeView`, this, 'front');
        this.setState({
            view: 'front'
        });
    }

    handleSideView() {
        app.call(`changeView`, this, 'side');
        this.setState({
            view: 'side'
        });
    }

    handleTopView() {
        app.call(`changeView`, this, 'top');
        this.setState({
            view: 'top'
        });
    }

    // ----------------------------- 网格模式 ------------------------------------------

    handleGridMode() {
        const isGridMode = !this.state.isGridMode;

        if (isGridMode) {
            app.editor.scene.overrideMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
        } else {
            app.editor.scene.overrideMaterial = null;
        }

        this.setState({
            isGridMode
        });
    }
}

export default EditorToolbar;