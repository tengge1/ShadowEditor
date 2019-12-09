import { MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 示例菜单
 * @author tengge / https://github.com/tengge1
 */
class ExampleMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleArkanoid = this.handleArkanoid.bind(this);
        this.handleCamera = this.handleCamera.bind(this);
        this.handleParticle = this.handleParticle.bind(this);
    }

    render() {
        return <MenuItem title={_t('Example')}>
            <MenuItem title={_t('Arkanoid')}
                onClick={this.handleArkanoid}
            />
            <MenuItem title={_t('Camera')}
                onClick={this.handleCamera}
            />
            <MenuItem title={_t('Particle')}
                onClick={this.handleParticle}
            />
            <MenuItemSeparator />
        </MenuItem>;
    }

    handleArkanoid() {
        app.call(`load`, this, 'assets/examples/arkanoid.json', _t('Arkanoid'));
    }

    handleCamera() {
        app.call(`load`, this, 'assets/examples/camera.json', _t('Camera'));
    }

    handleParticle() {
        app.call(`load`, this, 'assets/examples/particle.json', _t('Particle'));
    }

    handleParticle1() {
        const loader = new THREE.FileLoader();
        loader.load('assets/examples/particles.app.json', text => {
            const json = JSON.parse(text);

            const loader = new THREE.ObjectLoader();

            app.editor.clear(false);

            const camera = loader.parse(json.camera);

            app.editor.camera.copy(camera);
            app.editor.camera.aspect = app.editor.DEFAULT_CAMERA.aspect;
            app.editor.camera.updateProjectionMatrix();

            if (json.scripts) {
                for (const uuid in json.scripts) {
                    const scripts = json.scripts[uuid];

                    // 说明: three.js示例中，物体和脚本的uuid是一致的，
                    // 这会导致本编辑器报错。
                    scripts.forEach(script => {
                        const newScript = THREE.Math.generateUUID();

                        app.editor.scripts[newScript] = {
                            id: '',
                            name: script.name,
                            type: 'javascript',
                            source: script.source,
                            uuid: newScript
                        };
                    });
                }
            }

            app.editor.setScene(loader.parse(json.scene));
        });
    }
}

export default ExampleMenu;