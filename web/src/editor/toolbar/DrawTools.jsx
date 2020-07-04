/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { ToolbarSeparator, IconButton } from '../../ui/index';
import AddObjectCommand from '../../command/AddObjectCommand';
import DigTool from '../tools/DigTool';

/**
 * 绘制工具
 * @author tengge / https://github.com/tengge1
 */
class DrawTools extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAddingPoint: false,
            isAddingLine: false,
            isAddingPolygon: false,
            isSpraying: false,
            isDigging: false
        };

        this.handleAddPoint = this.handleAddPoint.bind(this);
        this.onAddPointIntersect = this.onAddPointIntersect.bind(this);

        this.handleAddLine = this.handleAddLine.bind(this);
        this.onAddLineIntersect = this.onAddLineIntersect.bind(this);
        this.onAddLineDblClick = this.onAddLineDblClick.bind(this);

        this.handleAddPolygon = this.handleAddPolygon.bind(this);
        this.onAddPolygonIntersect = this.onAddPolygonIntersect.bind(this);
        this.onAddPolygonDblClick = this.onAddPolygonDblClick.bind(this);

        this.handleSpray = this.handleSpray.bind(this);
        this.onSprayIntersect = this.onSprayIntersect.bind(this);

        this.handleDig = this.handleDig.bind(this);
    }

    render() {
        const { isAddingPoint, isAddingLine, isAddingPolygon, isSpraying, isDigging } = this.state;

        return <>
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
        </>;
    }

    // --------------------------------- 画点 ------------------------------------------

    handleAddPoint() {
        const isAddingPoint = !this.state.isAddingPoint;

        this.setState({ isAddingPoint });

        if (isAddingPoint) {
            app.editor.gpuPickNum++;
            app.on(`intersect.EditorToolbarAddPoint`, this.onAddPointIntersect);
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

        app.editor.gpuPickNum--;
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
            app.editor.gpuPickNum++;
            app.on(`intersect.EditorToolbarAddLine`, this.onAddLineIntersect);
            app.on(`dblclick.EditorToolbarAddLine`, this.onAddLineDblClick);

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
            app.on(`intersect.EditorToolbarAddPolygon`, this.onAddPolygonIntersect);
            app.on(`dblclick.EditorToolbarAddPolygon`, this.onAddPolygonDblClick);

            var geometry = new THREE.BufferGeometry();

            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(300), 3));
            geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(300), 3));
            geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(200), 2));

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
            app.on(`intersect.EditorToolbarSpray`, this.onSprayIntersect);
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
}

export default DrawTools;