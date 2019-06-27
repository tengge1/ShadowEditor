import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 光源菜单
 * @author tengge / https://github.com/tengge1
 */
class LightMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddAmbientLight = this.handleAddAmbientLight.bind(this);
        this.handleAddDirectionalLight = this.handleAddDirectionalLight.bind(this);
        this.handleAddPointLight = this.handleAddPointLight.bind(this);
        this.handleAddSpotLight = this.handleAddSpotLight.bind(this);
        this.handleAddHemisphereLight = this.handleAddHemisphereLight.bind(this);
        this.handleAddRectAreaLight = this.handleAddRectAreaLight.bind(this);
    }

    render() {
        const { className, style } = this.props;

        return <MenuItem title={L_LIGHT}>
            <MenuItem title={L_AMBIENT_LIGHT} onClick={this.handleAddAmbientLight}></MenuItem>
            <MenuItem title={L_DIRECTIONAL_LIGHT} onClick={this.handleAddAmbientLight}></MenuItem>
            <MenuItem title={L_POINT_LIGHT} onClick={this.handleAddAmbientLight}></MenuItem>
            <MenuItem title={L_SPOT_LIGHT} onClick={this.handleAddAmbientLight}></MenuItem>
            <MenuItem title={L_HEMISPHERE_LIGHT} onClick={this.handleAddAmbientLight}></MenuItem>
            <MenuItem title={L_RECT_AREA_LIGHT} onClick={this.handleAddAmbientLight}></MenuItem>
        </MenuItem>;
    }

    // ------------------------- 环境光 ------------------------------

    handleAddAmbientLight() {
        var editor = app.editor;

        var color = 0xaaaaaa;

        var light = new THREE.AmbientLight(color);
        light.name = L_AMBIENT_LIGHT;

        editor.execute(new AddObjectCommand(light));
    }

    // ------------------------- 平行光 ------------------------------

    handleAddDirectionalLight() {
        var editor = app.editor;

        var color = 0xffffff;
        var intensity = 1;

        var light = new THREE.DirectionalLight(color, intensity);
        light.name = L_DIRECTIONAL_LIGHT;
        light.castShadow = true;
        light.shadow.mapSize.x = 2048;
        light.shadow.mapSize.y = 2048;
        light.shadow.camera.left = -100;
        light.shadow.camera.right = 100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        light.position.set(5, 10, 7.5);

        editor.execute(new AddObjectCommand(light));
    }

    // ------------------------- 点光源 ------------------------------

    handleAddPointLight() {
        var editor = app.editor;

        var color = 0xffffff;
        var intensity = 1;
        var distance = 0;

        var light = new PointLight(color, intensity, distance);
        light.name = L_POINT_LIGHT;
        light.position.y = 5;
        light.castShadow = true;

        editor.execute(new AddObjectCommand(light));
    }

    // ------------------------- 聚光灯 ------------------------------

    handleAddSpotLight() {
        var editor = app.editor;

        var color = 0xffffff;
        var intensity = 1;
        var distance = 0;
        var angle = Math.PI * 0.1;
        var penumbra = 0;

        var light = new THREE.SpotLight(color, intensity, distance, angle, penumbra);

        light.name = L_SPOT_LIGHT;
        light.castShadow = true;

        light.position.set(5, 10, 7.5);

        editor.execute(new AddObjectCommand(light));
    }

    // ------------------------- 半球光 ------------------------------

    handleAddHemisphereLight() {
        var editor = app.editor;
        var skyColor = 0x00aaff;
        var groundColor = 0xffaa00;
        var intensity = 1;

        var light = new HemisphereLight(skyColor, groundColor, intensity);
        light.name = L_HEMISPHERE_LIGHT;

        light.position.set(0, 10, 0);

        editor.execute(new AddObjectCommand(light));
    }

    // ------------------------- 矩形光 ------------------------------

    handleAddRectAreaLight() {
        var editor = app.editor;

        var color = 0xffffff;
        var intensity = 1;
        var width = 20;
        var height = 10;

        var light = new RectAreaLight(color, intensity, width, height);
        light.name = L_RECT_AREA_LIGHT;

        light.position.set(0, 6, 0);

        editor.execute(new AddObjectCommand(light));
    }
}

export default LightMenu;