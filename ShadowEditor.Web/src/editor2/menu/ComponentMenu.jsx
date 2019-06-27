import { PropTypes, MenuItem, MenuItemSeparator } from '../../third_party';

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
    }

    render() {
        return <MenuItem title={L_COMPONENT}>
            <MenuItem title={L_BACKGROUND_MUSIC} onClick={this.handleAddBackgroundMusic}></MenuItem>
            <MenuItem title={L_PARTICLE_EMITTER} onClick={this.handleParticleEmitter}></MenuItem>
            <MenuItem title={L_SKY} onClick={this.handleAddSky}></MenuItem>
            <MenuItem title={L_FIRE} onClick={this.handleAddFire}></MenuItem>
            <MenuItem title={L_WATER} onClick={this.handleAddWater}></MenuItem>
            <MenuItem title={L_SMOKE} onClick={this.handleAddSmoke}></MenuItem>
            <MenuItem title={L_CLOTH} onClick={this.handleAddCloth}></MenuItem>
        </MenuItem>;
    }

    // ---------------------------- 添加背景音乐 ----------------------------------

    handleAddBackgroundMusic() {
        var editor = app.editor;
        var listener = editor.audioListener;

        var audio = new THREE.Audio(listener);
        audio.name = L_BACKGROUND_MUSIC;
        audio.autoplay = false;
        audio.setLoop(true);
        audio.setVolume(1.0);

        audio.userData.autoplay = true;

        app.editor.execute(new AddObjectCommand(audio));
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
        obj.name = L_SKY;
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

        cloth.name = L_CLOTH;

        editor.execute(new AddObjectCommand(cloth));
    }
}

export default ComponentMenu;