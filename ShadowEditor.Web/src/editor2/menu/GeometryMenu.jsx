import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';
import AddObjectCommand from '../../command/AddObjectCommand';

import Group from '../../object/geometry/Group';
import Plane from '../../object/geometry/Plane';
import Box from '../../object/geometry/Box';
import Circle from '../../object/geometry/Circle';
import Cylinder from '../../object/geometry/Cylinder';
import Sphere from '../../object/geometry/Sphere';
import Icosahedron from '../../object/geometry/Icosahedron';
import Torus from '../../object/geometry/Torus';
import TorusKnot from '../../object/geometry/TorusKnot';
import Teapot from '../../object/geometry/Teapot';
import Lathe from '../../object/geometry/Lathe';
import Sprite from '../../object/geometry/Sprite';
import Text from '../../object/geometry/Text';

import LineCurve from '../../object/line/LineCurve';
import CatmullRomCurve from '../../object/line/CatmullRomCurve';
import QuadraticBezierCurve from '../../object/line/QuadraticBezierCurve';
import CubicBezierCurve from '../../object/line/CubicBezierCurve';
import EllipseCurve from '../../object/line/EllipseCurve';

import SplineHelper from '../../helper/line/SplineHelper';

/**
 * 几何体菜单
 * @author tengge / https://github.com/tengge1
 */
class GeometryMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddGroup = this.handleAddGroup.bind(this);
        this.handleAddPlane = this.handleAddPlane.bind(this);
        this.handleAddBox = this.handleAddBox.bind(this);
        this.handleAddCircle = this.handleAddCircle.bind(this);
        this.handleAddCylinder = this.handleAddCylinder.bind(this);
        this.handleAddSphere = this.handleAddSphere.bind(this);
        this.handleAddIcosahedron = this.handleAddIcosahedron.bind(this);
        this.handleAddTorus = this.handleAddTorus.bind(this);
        this.handleAddTorusKnot = this.handleAddTorusKnot.bind(this);
        this.handleAddTeaport = this.handleAddTeaport.bind(this);
        this.handleAddLathe = this.handleAddLathe.bind(this);
        this.handleAddSprite = this.handleAddSprite.bind(this);
        this.handleAddText = this.handleAddText.bind(this);
        this.handleAddLineCurve = this.handleAddLineCurve.bind(this);
        this.handleAddCatmullRomCurve = this.handleAddCatmullRomCurve.bind(this);
        this.handleAddQuadraticBezierCurve = this.handleAddQuadraticBezierCurve.bind(this);
        this.handleAddCubicBezierCurve = this.handleAddCubicBezierCurve.bind(this);
        this.handleAddEllipseCurve = this.handleAddEllipseCurve.bind(this);
    }

    render() {
        return <MenuItem title={L_GEOMETRY}>
            <MenuItem title={L_GROUP} onClick={this.handleAddGroup}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_PLANE} onClick={this.handleAddPlane}></MenuItem>
            <MenuItem title={L_BOX} onClick={this.handleAddBox}></MenuItem>
            <MenuItem title={L_CIRCLE} onClick={this.handleAddCircle}></MenuItem>
            <MenuItem title={L_CYLINDER} onClick={this.handleAddCylinder}></MenuItem>
            <MenuItem title={L_SPHERE} onClick={this.handleAddSphere}></MenuItem>
            <MenuItem title={L_ICOSAHEDRON} onClick={this.handleAddIcosahedron}></MenuItem>
            <MenuItem title={L_TORUS} onClick={this.handleAddTorus}></MenuItem>
            <MenuItem title={L_TORUS_KNOT} onClick={this.handleAddTorusKnot}></MenuItem>
            <MenuItem title={L_TEAPOT} onClick={this.handleAddTeaport}></MenuItem>
            <MenuItem title={L_LATHE} onClick={this.handleAddLathe}></MenuItem>
            <MenuItem title={L_SPRITE} onClick={this.handleAddSprite}></MenuItem>
            <MenuItem title={L_TEXT} onClick={this.handleAddText}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_LINE_CURVE} onClick={this.handleAddLineCurve}></MenuItem>
            <MenuItem title={L_CATMULL_ROM_CURVE} onClick={this.handleAddCatmullRomCurve}></MenuItem>
            <MenuItem title={L_QUADRATIC_BEZIER_CURVE} onClick={this.handleAddQuadraticBezierCurve}></MenuItem>
            <MenuItem title={L_CUBIC_BEZIER_CURVE} onClick={this.handleAddCubicBezierCurve}></MenuItem>
            <MenuItem title={L_ELLIPSE_CURVE} onClick={this.handleAddEllipseCurve}></MenuItem>
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