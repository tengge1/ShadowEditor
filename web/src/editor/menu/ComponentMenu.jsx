/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { MenuItem, MenuItemSeparator } from '../../ui/index';
import AddObjectCommand from '../../command/AddObjectCommand';
import Sky from '../../object/component/Sky';
import Fire from '../../object/component/Fire';
import Water from '../../object/component/Water';
import Smoke from '../../object/component/Smoke';
import Cloth from '../../object/component/Cloth';
import ParticleEmitter from '../../object/component/ParticleEmitter';
import PerlinTerrain from '../../object/terrain/PerlinTerrain';
import ShaderTerrain from '../../object/terrain/ShaderTerrain';
import SkyBall from '../../object/component/SkyBall';

/**
 * 组件菜单
 * @author tengge / https://github.com/tengge1
 */
class ComponentMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddBackgroundMusic = this.handleAddBackgroundMusic.bind(this);
        this.handleParticleEmitter = this.handleParticleEmitter.bind(this);
        this.handleAddSky = this.handleAddSky.bind(this);
        this.handleAddFire = this.handleAddFire.bind(this);
        this.handleAddWater = this.handleAddWater.bind(this);
        this.handleAddSmoke = this.handleAddSmoke.bind(this);
        this.handleAddCloth = this.handleAddCloth.bind(this);
        this.handleAddPerlinTerrain = this.handleAddPerlinTerrain.bind(this);
        this.handleAddSkyBall = this.handleAddSkyBall.bind(this);
        this.handleAddShaderTerrain = this.handleAddShaderTerrain.bind(this);
    }

    render() {
        return <MenuItem title={_t('Component')}>
            <MenuItem title={_t('Background Music')}
                onClick={this.handleAddBackgroundMusic}
            />
            <MenuItem title={_t('ParticleEmitter')}
                onClick={this.handleParticleEmitter}
            />
            <MenuItemSeparator />
            <MenuItem title={_t('Sky')}
                onClick={this.handleAddSky}
            />
            <MenuItem title={_t('Fire')}
                onClick={this.handleAddFire}
            />
            <MenuItem title={_t('Water')}
                onClick={this.handleAddWater}
            />
            <MenuItem title={_t('Smoke')}
                onClick={this.handleAddSmoke}
            />
            <MenuItem title={_t('Cloth')}
                onClick={this.handleAddCloth}
            />
            <MenuItem title={_t('Perlin Terrain')}
                onClick={this.handleAddPerlinTerrain}
            />
            <MenuItem title={_t('Sky Ball')}
                onClick={this.handleAddSkyBall}
            />
            {
                //<MenuItem title={'着色器地形'} onClick={this.handleAddShaderTerrain}></MenuItem> 
            }
        </MenuItem>;
    }

    // ---------------------------- 添加背景音乐 ----------------------------------

    handleAddBackgroundMusic() {
        var editor = app.editor;

        setTimeout(() => {
            var listener = editor.audioListener;

            var audio = new THREE.Audio(listener);
            audio.name = _t('Background Music');
            audio.autoplay = false;
            audio.setLoop(true);
            audio.setVolume(1.0);
    
            audio.userData.autoplay = true;
    
            app.editor.execute(new AddObjectCommand(audio));
        });
    }

    // ---------------------------- 添加粒子发射器 --------------------------------------------

    handleParticleEmitter() {
        var emitter = new ParticleEmitter();
        app.editor.execute(new AddObjectCommand(emitter));
        emitter.userData.group.tick(0);
    }

    // ---------------------------- 天空 ----------------------------------------

    handleAddSky() {
        var obj = new Sky();
        obj.name = _t('Sky');
        obj.userData.type = 'Sky';
        app.editor.execute(new AddObjectCommand(obj));
    }

    // ---------------------------- 添加火焰 -------------------------------------

    handleAddFire() {
        var editor = app.editor;

        var fire = new Fire(editor.camera);

        editor.execute(new AddObjectCommand(fire));

        fire.userData.fire.update(0);
    }

    // -------------------------- 添加水 ---------------------------------------

    handleAddWater() {
        var editor = app.editor;

        var water = new Water(editor.renderer);

        editor.execute(new AddObjectCommand(water));

        water.update();
    }

    // ------------------------------ 添加烟 ------------------------------------

    handleAddSmoke() {
        var editor = app.editor;
        var camera = editor.camera;
        var renderer = editor.renderer;

        var smoke = new Smoke(camera, renderer);

        smoke.position.y = 3;

        editor.execute(new AddObjectCommand(smoke));

        smoke.update(0);
    }

    // ----------------------------- 添加布 ------------------------------------

    handleAddCloth() {
        var editor = app.editor;

        var cloth = new Cloth();

        cloth.name = _t('Cloth');

        editor.execute(new AddObjectCommand(cloth));
    }

    // ----------------------------- 添加柏林地形 -------------------------------

    handleAddPerlinTerrain() {
        let terrain = new PerlinTerrain();

        terrain.name = _t('Perlin Terrain');

        app.editor.execute(new AddObjectCommand(terrain));
    }

    // ------------------------ 天空球 -------------------------------------------

    handleAddSkyBall() {
        app.toast(_t('Please click the sky ball in the MapPanel.'));
        app.on(`selectMap.ComponentMenu`, obj => {
            if (obj.Type !== 'skyBall') {
                app.toast(_t('The map you clicked is not sky ball.'), 'warn');
                return;
            }
            app.on(`selectMap.ComponentMenu`, null);
            const ball = new SkyBall(`${app.options.server}${obj.Url}`);
            ball.name = obj.Name;
            app.editor.addObject(ball);
        });
    }

    // ----------------------------- 添加着色器地形 --------------------------------

    handleAddShaderTerrain() {
        app.require('NormalMapShader').then(() => {
            let terrain = new ShaderTerrain(app.editor.renderer);
            terrain.name = _t('Shader Terrain');
            app.editor.execute(new AddObjectCommand(terrain));
            terrain.update(0);
        });
    }
}

export default ComponentMenu;