import UI from '../../ui/UI';
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

import Spline from '../../object/line/Spline';

import SplineHelper from '../../helper/line/SplineHelper';

/**
 * 几何体菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function GeometryMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

GeometryMenu.prototype = Object.create(UI.Control.prototype);
GeometryMenu.prototype.constructor = GeometryMenu;

GeometryMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: L_GEOMETRY
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                html: L_GROUP,
                cls: 'option',
                onClick: this.addGroup.bind(this)
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                html: L_PLANE,
                cls: 'option',
                onClick: this.addPlane.bind(this)
            }, {
                xtype: 'div',
                html: L_BOX,
                cls: 'option',
                onClick: this.addBox.bind(this)
            }, {
                xtype: 'div',
                html: L_CIRCLE,
                cls: 'option',
                onClick: this.addCircle.bind(this)
            }, {
                xtype: 'div',
                html: L_CYLINDER,
                cls: 'option',
                onClick: this.addCylinder.bind(this)
            }, {
                xtype: 'div',
                html: L_SPHERE,
                cls: 'option',
                onClick: this.addSphere.bind(this)
            }, {
                xtype: 'div',
                html: L_ICOSAHEDRON,
                cls: 'option',
                onClick: this.addIcosahedron.bind(this)
            }, {
                xtype: 'div',
                html: L_TORUS,
                cls: 'option',
                onClick: this.addTorus.bind(this)
            }, {
                xtype: 'div',
                html: L_TORUS_KNOT,
                cls: 'option',
                onClick: this.addTorusKnot.bind(this)
            }, {
                xtype: 'div',
                html: L_TEAPOT,
                cls: 'option',
                onClick: this.addTeaport.bind(this)
            }, {
                xtype: 'div',
                html: L_LATHE,
                cls: 'option',
                onClick: this.addLathe.bind(this)
            }, {
                xtype: 'div',
                id: 'mAddSprite',
                html: L_SPRITE,
                cls: 'option',
                onClick: this.addSprite.bind(this)
            }, {
                xtype: 'div',
                html: L_TEXT,
                cls: 'option',
                onClick: this.addText.bind(this)
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                html: '线段',
                cls: 'option',
                onClick: this.addLineCurve3.bind(this)
            }, {
                xtype: 'div',
                html: 'CatmullRom曲线',
                cls: 'option',
                onClick: this.addSpline.bind(this)
            }, {
                xtype: 'div',
                html: 'CubicBezier曲线',
                cls: 'option',
            }, {
                xtype: 'div',
                html: 'CubicBezier曲线',
                cls: 'option',
            }, {
                xtype: 'div',
                html: 'EllipseCurve曲线',
                cls: 'option',
            }, {
                xtype: 'div',
                html: 'QuadraticBezier曲线',
                cls: 'option',
            }, {
                xtype: 'div',
                html: 'SplineCurve曲线',
                cls: 'option',
            }, {
                xtype: 'div',
                html: '管线',
                cls: 'option',
            }]
        }]
    });

    container.render();
}

// ------------------------- 组 ---------------------------------

GeometryMenu.prototype.addGroup = function () {
    this.app.editor.execute(new AddObjectCommand(new Group()));
};

// ------------------------- 平板 -------------------------------

GeometryMenu.prototype.addPlane = function () {
    this.app.editor.execute(new AddObjectCommand(new Plane()));
};

// ------------------------ 正方体 -----------------------------

GeometryMenu.prototype.addBox = function () {
    this.app.editor.execute(new AddObjectCommand(new Box()));
};

// ------------------------ 圆 ----------------------------------

GeometryMenu.prototype.addCircle = function () {
    this.app.editor.execute(new AddObjectCommand(new Circle()));
};

// ------------------------圆柱体 -------------------------------

GeometryMenu.prototype.addCylinder = function () {
    this.app.editor.execute(new AddObjectCommand(new Cylinder()));
};

// ------------------------ 球体 -------------------------------

GeometryMenu.prototype.addSphere = function () {
    this.app.editor.execute(new AddObjectCommand(new Sphere()));
};

// ----------------------- 二十面体 -----------------------------

GeometryMenu.prototype.addIcosahedron = function () {
    this.app.editor.execute(new AddObjectCommand(new Icosahedron()));
};

// ----------------------- 轮胎 ---------------------------------

GeometryMenu.prototype.addTorus = function () {
    this.app.editor.execute(new AddObjectCommand(new Torus()));
};

// ----------------------- 纽结 ---------------------------------

GeometryMenu.prototype.addTorusKnot = function () {
    this.app.editor.execute(new AddObjectCommand(new TorusKnot()));
};

// ---------------------- 茶壶 ----------------------------------

GeometryMenu.prototype.addTeaport = function () {
    this.app.editor.execute(new AddObjectCommand(new Teapot()));
};

// ---------------------- 酒杯 ----------------------------------

GeometryMenu.prototype.addLathe = function () {
    this.app.editor.execute(new AddObjectCommand(new Lathe()));
};

// ---------------------- 精灵 -----------------------------------

GeometryMenu.prototype.addSprite = function () {
    this.app.editor.execute(new AddObjectCommand(new Sprite()));
};

// ---------------------- 文本 ----------------------------------

GeometryMenu.prototype.addText = function () {
    UI.prompt(L_PLEASE_INPUT, null, L_SOME_WORDS, (event, value) => {
        this.app.editor.execute(new AddObjectCommand(new Text(value)));
    });
};

// ---------------------- 线段 ----------------------------------

GeometryMenu.prototype.addLineCurve3 = function () {
    UI.msg('添加线段成功！');
};

// ---------------------- 曲线 ----------------------------------

GeometryMenu.prototype.addSpline = function () {
    var line = new Spline();
    var helper = new SplineHelper(line);

    this.app.editor.execute(new AddObjectCommand(line));
    this.app.editor.addRawHelper(helper);
};

export default GeometryMenu;