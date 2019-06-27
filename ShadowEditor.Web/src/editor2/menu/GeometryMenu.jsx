import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 几何体菜单
 * @author tengge / https://github.com/tengge1
 */
class GeometryMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        alert('Hello, world!');
    }

    render() {
        return <MenuItem title={L_GEOMETRY}>
            <MenuItem title={L_GROUP}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_PLANE}></MenuItem>
            <MenuItem title={L_BOX}></MenuItem>
            <MenuItem title={L_CIRCLE}></MenuItem>
            <MenuItem title={L_CYLINDER}></MenuItem>
            <MenuItem title={L_SPHERE}></MenuItem>
            <MenuItem title={L_ICOSAHEDRON}></MenuItem>
            <MenuItem title={L_TORUS}></MenuItem>
            <MenuItem title={L_TORUS_KNOT}></MenuItem>
            <MenuItem title={L_TEAPOT}></MenuItem>
            <MenuItem title={L_LATHE}></MenuItem>
            <MenuItem title={L_SPRITE}></MenuItem>
            <MenuItem title={L_TEXT}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_LINE_CURVE}></MenuItem>
            <MenuItem title={L_CATMULL_ROM_CURVE}></MenuItem>
            <MenuItem title={L_QUADRATIC_BEZIER_CURVE}></MenuItem>
            <MenuItem title={L_CUBIC_BEZIER_CURVE}></MenuItem>
            <MenuItem title={L_ELLIPSE_CURVE}></MenuItem>
        </MenuItem>;
    }

    // ------------------------- 组 ---------------------------------

    handleAddGroup() {
        app.editor.execute(new AddObjectCommand(new Group()));
    }

    // ------------------------- 平板 -------------------------------

    handleAddPlane() {
        app.editor.execute(new AddObjectCommand(new Plane()));
    }

    // ------------------------ 正方体 -----------------------------

    handleAddBox() {
        app.editor.execute(new AddObjectCommand(new Box()));
    }

    // ------------------------ 圆 ----------------------------------

    handleAddCircle() {
        app.editor.execute(new AddObjectCommand(new Circle()));
    }

    // ------------------------圆柱体 -------------------------------

    handleAddCylinder() {
        app.editor.execute(new AddObjectCommand(new Cylinder()));
    }

    // ------------------------ 球体 -------------------------------

    handleAddSphere() {
        app.editor.execute(new AddObjectCommand(new Sphere()));
    }

    // ----------------------- 二十面体 -----------------------------

    handleAddIcosahedron() {
        app.editor.execute(new AddObjectCommand(new Icosahedron()));
    }

    // ----------------------- 轮胎 ---------------------------------

    handleAddTorus() {
        app.editor.execute(new AddObjectCommand(new Torus()));
    }

    // ----------------------- 纽结 ---------------------------------

    handleAddTorusKnot() {
        app.editor.execute(new AddObjectCommand(new TorusKnot()));
    }

    // ---------------------- 茶壶 ----------------------------------

    handleAddTeaport() {
        app.editor.execute(new AddObjectCommand(new Teapot()));
    }

    // ---------------------- 酒杯 ----------------------------------

    handleAddLathe() {
        app.editor.execute(new AddObjectCommand(new Lathe()));
    }

    // ---------------------- 精灵 -----------------------------------

    handleAddSprite() {
        app.editor.execute(new AddObjectCommand(new Sprite()));
    }

    // ---------------------- 文本 ----------------------------------

    handleAddText() {
        UI.prompt(L_PLEASE_INPUT, null, L_SOME_WORDS, (event, value) => {
            app.editor.execute(new AddObjectCommand(new Text(value)));
        });
    }

    // ---------------------- 线段 ----------------------------------

    handleAddLineCurve() {
        var line = new LineCurve();
        app.editor.execute(new AddObjectCommand(line));
    }

    // ---------------------- CatmullRom曲线 ----------------------------------

    handleAddCatmullRomCurve() {
        var line = new CatmullRomCurve();
        app.editor.execute(new AddObjectCommand(line));
    }

    // ----------------------- 二次贝塞尔曲线 ---------------------------------

    handleAddQuadraticBezierCurve() {
        var line = new QuadraticBezierCurve();
        app.editor.execute(new AddObjectCommand(line));
    }

    // ----------------------- 三次贝塞尔曲线 ---------------------------------

    handleAddCubicBezierCurve() {
        var line = new CubicBezierCurve();
        app.editor.execute(new AddObjectCommand(line));
    }

    // --------------------- 椭圆曲线 ------------------------------------------

    handleAddEllipseCurve() {
        var line = new EllipseCurve();
        app.editor.execute(new AddObjectCommand(line));
    }
}

export default GeometryMenu;