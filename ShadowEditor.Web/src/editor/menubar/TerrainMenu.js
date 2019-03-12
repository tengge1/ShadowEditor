import UI from '../../ui/UI';
import AddObjectCommand from '../../command/AddObjectCommand';
import PerlinTerrain from '../../object/terrain/PerlinTerrain';
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
            html: L_TERRAIN
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: L_PERLIN_TERRAIN,
                onClick: this.createPerlinTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option inactive',
                html: L_SHADER_TERRAIN,
                onClick: this.createShaderTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option inactive',
                html: L_RAISE_TERRAIN,
                onClick: this.raiseTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option inactive',
                html: L_REDUCE_TERRAIN,
                onClick: this.reduceTerrain.bind(this)
            }, {
                xtype: 'div',
                cls: 'option inactive',
                html: L_PLANT_TREES,
                onClick: this.plantTrees.bind(this)
            }]
        }]
    });

    container.render();
}

// ---------------------------- 创建地形 -----------------------------------

TerrainMenu.prototype.createPerlinTerrain = function () {
    this.app.editor.execute(new AddObjectCommand(new PerlinTerrain()));
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