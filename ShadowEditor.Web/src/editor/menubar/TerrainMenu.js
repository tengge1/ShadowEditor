import UI from '../../ui/UI';
import AddObjectCommand from '../../command/AddObjectCommand';
import Terrain from '../../object/terrain/Terrain';
import ShaderTerrain from '../../object/terrain/ShaderTerrain';
import PhysicsTerrain from '../../object/terrain/PhysicsTerrain';

/**
 * 地形菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TerrainMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

TerrainMenu.prototype = Object.create(UI.Control.prototype);
TerrainMenu.prototype.constructor = TerrainMenu;

TerrainMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: '地形'
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: '柏林随机地形',
                onClick: this.createTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: '创建着色器地形',
                onClick: this.createShaderTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: '创建物理地形',
                onClick: this.createPhysicsTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: '升高地形',
                onClick: this.raiseTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: '降低地形',
                onClick: this.reduceTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option',
                html: '批量种树',
                onClick: this.plantTrees.bind(this)
            }]
        }]
    });

    container.render();
}

// ---------------------------- 创建地形 -----------------------------------

TerrainMenu.prototype.createTerrain = function () {
    this.app.editor.execute(new AddObjectCommand(new Terrain()));
};

// ---------------------------- 创建着色器地形 ----------------------------------------

TerrainMenu.prototype.createShaderTerrain = function () {
    var dom = this.app.viewport.container.dom;

    var terrain = new ShaderTerrain(this.app.editor.renderer, dom.clientWidth, dom.clientHeight);

    this.app.editor.execute(new AddObjectCommand(terrain));

    terrain.update(0);

    // this.app.on(`animate.Terrain2`, (clock, deltaTime) => {
    //     terrain.update(deltaTime);
    // });
};

// ----------------------------- 创建物理地形 ---------------------------------

TerrainMenu.prototype.createPhysicsTerrain = function () {
    var terrain = new PhysicsTerrain();

    this.app.editor.execute(new AddObjectCommand(terrain));

    this.app.physics.world.addRigidBody(terrain.userData.physicsBody);
    this.app.physics.rigidBodies.push(terrain);

    //     this.app.on(`animate.${this.id}`, (clock, deltaTime) => {
    //         terrain.update(deltaTime, this.app.physics.world);
    //     });
};

// ---------------------------- 升高地形 -----------------------------------

TerrainMenu.prototype.raiseTerrain = function () {

};

// ---------------------------- 降低地形 ------------------------------------

TerrainMenu.prototype.reduceTerrain = function () {

};

// ----------------------------- 批量种树 --------------------------------------

TerrainMenu.prototype.plantTrees = function () {

};

export default TerrainMenu;