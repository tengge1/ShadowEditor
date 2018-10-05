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
            html: '几何体'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                html: '组',
                cls: 'option',
                onClick: this.addGroup.bind(this)
            }, {
                xtype: 'hr'
            }, {
                xtype: 'div',
                html: '平板',
                cls: 'option',
                onClick: this.addPlane.bind(this)
            }, {
                xtype: 'div',
                html: '正方体',
                cls: 'option',
                onClick: this.addBox.bind(this)
            }, {
                xtype: 'div',
                html: '圆',
                cls: 'option',
                onClick: this.addCircle.bind(this)
            }, {
                xtype: 'div',
                html: '圆柱体',
                cls: 'option',
                onClick: this.addCylinder.bind(this)
            }, {
                xtype: 'div',
                html: '球体',
                cls: 'option',
                onClick: this.addSphere.bind(this)
            }, {
                xtype: 'div',
                html: '二十面体',
                cls: 'option',
                onClick: this.addIcosahedron.bind(this)
            }, {
                xtype: 'div',
                html: '轮胎',
                cls: 'option',
                onClick: this.addTorus.bind(this)
            }, {
                xtype: 'div',
                html: '扭结',
                cls: 'option',
                onClick: this.addTorusKnot.bind(this)
            }, {
                xtype: 'div',
                html: '茶壶',
                cls: 'option',
                onClick: this.addTeaport.bind(this)
            }, {
                xtype: 'div',
                html: '酒杯',
                cls: 'option',
                onClick: this.addLathe.bind(this)
            }, {
                xtype: 'div',
                id: 'mAddSprite',
                html: '精灵',
                cls: 'option',
                onClick: this.addSprite.bind(this)
            }, {
                xtype: 'div',
                html: '文本',
                cls: 'option',
                onClick: this.addText.bind(this)
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
    UI.prompt('请输入', null, '一些文字', (event, value) => {
        this.app.editor.execute(new AddObjectCommand(new Text(value)));
    });
};

export default GeometryMenu;