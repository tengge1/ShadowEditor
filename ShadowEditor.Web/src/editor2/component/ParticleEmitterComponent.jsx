import IntegerProperty, { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty, SelectProperty, ColorProperty, TextureProperty, ButtonsProperty, Button } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';
import Converter from '../../utils/Converter';
import Ajax from '../../utils/Ajax';

/**
 * 粒子发射器组件
 * @author tengge / https://github.com/tengge1
 */
class ParticleEmitterComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;
        this.isPlaying = false;

        this.state = {
            show: false,
            expanded: true,

            positionX: 0,
            positionY: 0,
            positionZ: 0,

            positionSpreadX: 0,
            positionSpreadY: 0,
            positionSpreadZ: 0,

            velocityX: 0,
            velocityY: 0,
            velocityZ: 0,

            velocitySpreadX: 0,
            velocitySpreadY: 0,
            velocitySpreadZ: 0,

            accelerationX: 0,
            accelerationY: 0,
            accelerationZ: 0,

            accelerationSpreadX: 0,
            accelerationSpreadY: 0,
            accelerationSpreadZ: 0,

            color1: null,
            color2: null,
            color3: null,
            color4: null,

            size: 1,
            sizeSpread: 0,
            texture: null,
            particleCount: 1000,
            maxAge: 5,
            maxAgeSpread: 2,
            previewText: L_PLAY,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChangePosition = this.handleChangePosition.bind(this);
        this.handleChangeVelocity = this.handleChangeVelocity.bind(this);
        this.handleChangeAcceleration = this.handleChangeAcceleration.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);
        this.handleChangeSize = this.handleChangeSize.bind(this);
        this.handleChangeTexture = this.handleChangeTexture.bind(this);
        this.handleChangeParticleCount = this.handleChangeParticleCount.bind(this);
        this.handleChangeMaxAge = this.handleChangeMaxAge.bind(this);
        this.handleChangeMaxAgeSpread = this.handleChangeMaxAgeSpread.bind(this);

        this.handlePreview = this.handlePreview.bind(this);
        this.startPreview = this.startPreview.bind(this);
        this.stopPreview = this.stopPreview.bind(this);
        this.onAnimate = this.onAnimate.bind(this);
    }

    render() {
        const {
            show, expanded, positionX, positionY, positionZ, positionSpreadX, positionSpreadY, positionSpreadZ, velocityX, velocityY, velocityZ,
            velocitySpreadX, velocitySpreadY, velocitySpreadZ, accelerationX, accelerationY, accelerationZ, accelerationSpreadX, accelerationSpreadY,
            accelerationSpreadZ, color1, color2, color3, color4, size, sizeSpread, texture, particleCount, maxAge, maxAgeSpread, previewText
        } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_PARTICLE_EMITTER} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty label={`${L_POSITION}X`} name={'positionX'} value={positionX} onChange={this.handleChangePosition}></NumberProperty>
            <NumberProperty label={`${L_POSITION}Y`} name={'positionY'} value={positionY} onChange={this.handleChangePosition}></NumberProperty>
            <NumberProperty label={`${L_POSITION}Z`} name={'positionZ'} value={positionZ} onChange={this.handleChangePosition}></NumberProperty>
            <NumberProperty label={`${L_POSITION_SPREAD}X`} name={'positionSpreadX'} value={positionSpreadX} onChange={this.handleChangePosition}></NumberProperty>
            <NumberProperty label={`${L_POSITION_SPREAD}Y`} name={'positionSpreadY'} value={positionSpreadY} onChange={this.handleChangePosition}></NumberProperty>
            <NumberProperty label={`${L_POSITION_SPREAD}Z`} name={'positionSpreadZ'} value={positionSpreadZ} onChange={this.handleChangePosition}></NumberProperty>

            <NumberProperty label={`${L_VELOCITY}X`} name={'velocityX'} value={velocityX} onChange={this.handleChangeVelocity}></NumberProperty>
            <NumberProperty label={`${L_VELOCITY}Y`} name={'velocityY'} value={velocityY} onChange={this.handleChangeVelocity}></NumberProperty>
            <NumberProperty label={`${L_VELOCITY}Z`} name={'velocityZ'} value={velocityZ} onChange={this.handleChangeVelocity}></NumberProperty>
            <NumberProperty label={`${L_VELOCITY_SPREAD}X`} name={'velocitySpreadX'} value={velocitySpreadX} onChange={this.handleChangeVelocity}></NumberProperty>
            <NumberProperty label={`${L_VELOCITY_SPREAD}Y`} name={'velocitySpreadY'} value={velocitySpreadY} onChange={this.handleChangeVelocity}></NumberProperty>
            <NumberProperty label={`${L_VELOCITY_SPREAD}Z`} name={'velocitySpreadZ'} value={velocitySpreadZ} onChange={this.handleChangeVelocity}></NumberProperty>

            <NumberProperty label={`${L_ACCELERATION}X`} name={'accelerationX'} value={accelerationX} onChange={this.handleChangeAcceleration}></NumberProperty>
            <NumberProperty label={`${L_ACCELERATION}Y`} name={'accelerationY'} value={accelerationY} onChange={this.handleChangeAcceleration}></NumberProperty>
            <NumberProperty label={`${L_ACCELERATION}Z`} name={'accelerationZ'} value={accelerationZ} onChange={this.handleChangeAcceleration}></NumberProperty>
            <NumberProperty label={`${L_ACCELERATION_SPREAD}X`} name={'accelerationSpreadX'} value={accelerationSpreadX} onChange={this.handleChangeAcceleration}></NumberProperty>
            <NumberProperty label={`${L_ACCELERATION_SPREAD}Y`} name={'accelerationSpreadY'} value={accelerationSpreadY} onChange={this.handleChangeAcceleration}></NumberProperty>
            <NumberProperty label={`${L_ACCELERATION_SPREAD}Z`} name={'accelerationSpreadZ'} value={accelerationSpreadZ} onChange={this.handleChangeAcceleration}></NumberProperty>

            <ColorProperty label={`${L_COLOR}1`} name={'color1'} value={color1} onChange={this.handleChangeColor}></ColorProperty>
            <ColorProperty label={`${L_COLOR}2`} name={'color2'} value={color2} onChange={this.handleChangeColor}></ColorProperty>
            <ColorProperty label={`${L_COLOR}3`} name={'color3'} value={color3} onChange={this.handleChangeColor}></ColorProperty>
            <ColorProperty label={`${L_COLOR}4`} name={'color4'} value={color4} onChange={this.handleChangeColor}></ColorProperty>

            <NumberProperty label={`${L_SIZE}`} name={'size'} value={size} onChange={this.handleChangeSize}></NumberProperty>
            <NumberProperty label={`${L_SIZE_SPREAD}`} name={'sizeSpread'} value={sizeSpread} onChange={this.handleChangeSize}></NumberProperty>

            <TextureProperty label={`${L_TEXTURE}`} name={'texture'} value={texture} onChange={this.handleChangeTexture}></TextureProperty>

            <IntegerProperty label={`${L_PARTICLE_COUNT}`} name={'particleCount'} value={particleCount} onChange={this.handleChangeParticleCount}></IntegerProperty>
            <NumberProperty label={`${L_MAX_AGE}`} name={'maxAge'} value={maxAge} onChange={this.handleChangeMaxAge}></NumberProperty>
            <NumberProperty label={`${L_MAX_AGE_SPREAD}`} name={'maxAgeSpread'} value={maxAgeSpread} onChange={this.maxAgeSpread}></NumberProperty>

            <ButtonProperty text={previewText} onChange={this.handlePreview}></ButtonProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.ParticleEmitterComponent`, this.handleUpdate);
        app.on(`objectChanged.ParticleEmitterComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        let state = {
            show: true,
        };

        if (this.selected instanceof THREE.Reflector) {
            Object.assign(state, {
                reflect: true,
                showColor: true,
                color: this.selected.userData.color,
                showSize: true,
                size: this.selected.userData.size,
                showClipBias: true,
                clipBias: this.selected.userData.clipBias,
                showRecursion: true,
                recursion: this.selected.userData.recursion,
            });
        } else {
            Object.assign(state, {
                reflect: false,
                showColor: false,
                showSize: false,
                showClipBias: false,
                showRecursion: false,
            });
        }

        this.setState(state);
    }

    handleChangePosition() {
        var positionX = UI.get('positionX', this.id);
        var positionY = UI.get('positionY', this.id);
        var positionZ = UI.get('positionZ', this.id);

        var positionSpreadX = UI.get('positionSpreadX', this.id);
        var positionSpreadY = UI.get('positionSpreadY', this.id);
        var positionSpreadZ = UI.get('positionSpreadZ', this.id);

        var group = this.selected.userData.group;
        var emitter = group.emitters[0];

        emitter.position.value.x = positionX.getValue();
        emitter.position.value.y = positionY.getValue();
        emitter.position.value.z = positionZ.getValue();

        emitter.position.spread.x = positionSpreadX.getValue();
        emitter.position.spread.y = positionSpreadY.getValue();
        emitter.position.spread.z = positionSpreadZ.getValue();

        emitter.updateFlags.position = true;
    }

    handleChangeVelocity() {
        var velocityX = UI.get('velocityX', this.id);
        var velocityY = UI.get('velocityY', this.id);
        var velocityZ = UI.get('velocityZ', this.id);

        var velocitySpreadX = UI.get('velocitySpreadX', this.id);
        var velocitySpreadY = UI.get('velocitySpreadY', this.id);
        var velocitySpreadZ = UI.get('velocitySpreadZ', this.id);

        var group = this.selected.userData.group;
        var emitter = group.emitters[0];

        emitter.velocity.value.x = velocityX.getValue();
        emitter.velocity.value.y = velocityY.getValue();
        emitter.velocity.value.z = velocityZ.getValue();

        emitter.velocity.spread.x = velocitySpreadX.getValue();
        emitter.velocity.spread.y = velocitySpreadY.getValue();
        emitter.velocity.spread.z = velocitySpreadZ.getValue();

        emitter.updateFlags.velocity = true;
    }

    handleChangeAcceleration() {
        var accelerationX = UI.get('accelerationX', this.id);
        var accelerationY = UI.get('accelerationY', this.id);
        var accelerationZ = UI.get('accelerationZ', this.id);

        var accelerationSpreadX = UI.get('accelerationSpreadX', this.id);
        var accelerationSpreadY = UI.get('accelerationSpreadY', this.id);
        var accelerationSpreadZ = UI.get('accelerationSpreadZ', this.id);

        var group = this.selected.userData.group;
        var emitter = group.emitters[0];

        emitter.acceleration.value.x = accelerationX.getValue();
        emitter.acceleration.value.y = accelerationY.getValue();
        emitter.acceleration.value.z = accelerationZ.getValue();

        emitter.acceleration.spread.x = accelerationSpreadX.getValue();
        emitter.acceleration.spread.y = accelerationSpreadY.getValue();
        emitter.acceleration.spread.z = accelerationSpreadZ.getValue();

        emitter.updateFlags.acceleration = true;
    }

    handleChangeColor = function () {
        var color1 = UI.get('color1', this.id);
        var color2 = UI.get('color2', this.id);
        var color3 = UI.get('color3', this.id);
        var color4 = UI.get('color4', this.id);

        var group = this.selected.userData.group;
        var emitter = group.emitters[0];

        emitter.color.value[0] = new THREE.Color(color1.getHexValue());
        emitter.color.value[1] = new THREE.Color(color2.getHexValue());
        emitter.color.value[2] = new THREE.Color(color3.getHexValue());
        emitter.color.value[3] = new THREE.Color(color4.getHexValue());

        emitter.updateFlags.color = true;
    }

    handleChangeSize() {
        var size = UI.get('size', this.id);
        var sizeSpread = UI.get('sizeSpread', this.id);

        var group = this.selected.userData.group;
        var emitter = group.emitters[0];

        for (var i = 0; i < emitter.size.value.length; i++) {
            emitter.size.value[i] = size.getValue();
            emitter.size.spread[i] = sizeSpread.getValue();
        }

        emitter.updateFlags.size = true;
    }

    handleChangeTexture() {
        var texture = UI.get('texture', this.id);

        var group = this.selected.userData.group;
        var emitter = group.emitters[0];

        texture = texture.getValue();
        texture.needsUpdate = true;

        group.texture = texture;
        group.material.uniforms.texture.value = texture;
    }

    handleChangeParticleCount() {
        var particleCount = UI.get('particleCount', this.id);

        var group = this.selected.userData.group;
        var emitter = group.emitters[0];

        emitter.particleCount = particleCount.getValue();

        emitter.updateFlags.params = true;
    }

    handleChangeMaxAge() {
        var maxAge = UI.get('maxAge', this.id);

        var group = this.selected.userData.group;
        var emitter = group.emitters[0];

        emitter.maxAge.value = maxAge.getValue();

        emitter.updateFlags.params = true;
    }

    handleChangeMaxAgeSpread() {
        var maxAgeSpread = UI.get('maxAgeSpread', this.id);

        var group = this.selected.userData.group;
        var emitter = group.emitters[0];

        emitter.maxAge.spread = maxAgeSpread.getValue();

        emitter.updateFlags.params = true;
    }

    handlePreview() {
        if (this.isPlaying) {
            this.stopPreview();
        } else {
            this.startPreview();
        }
    }

    startPreview() {
        var btnPreview = UI.get('btnPreview', this.id);

        this.isPlaying = true;
        btnPreview.setText(L_CANCEL);

        app.on(`animate.${this.id}`, this.onAnimate);
    }

    stopPreview() {
        var btnPreview = UI.get('btnPreview', this.id);

        this.isPlaying = false;
        btnPreview.setText(L_PREVIEW);

        var group = this.selected.userData.group;
        var emitter = this.selected.userData.emitter;

        group.removeEmitter(emitter);
        group.addEmitter(emitter);
        group.tick(0);

        app.on(`animate.${this.id}`, null);
    }

    onAnimate(clock, deltaTime) {
        var group = this.selected.userData.group;
        group.tick(deltaTime);
    }
}

export default ParticleEmitterComponent;