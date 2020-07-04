/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, ButtonProperty, NumberProperty, ColorProperty, TextureProperty, IntegerProperty } from '../../ui/index';

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
            previewText: _t('Preview')
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

        return <PropertyGroup title={_t('ParticleEmitter')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty label={`${_t('Position')}X`}
                name={'positionX'}
                value={positionX}
                onChange={this.handleChangePosition}
            />
            <NumberProperty label={`${_t('Position')}Y`}
                name={'positionY'}
                value={positionY}
                onChange={this.handleChangePosition}
            />
            <NumberProperty label={`${_t('Position')}Z`}
                name={'positionZ'}
                value={positionZ}
                onChange={this.handleChangePosition}
            />
            <NumberProperty label={`${_t('PositionSpread')}X`}
                name={'positionSpreadX'}
                value={positionSpreadX}
                onChange={this.handleChangePosition}
            />
            <NumberProperty label={`${_t('PositionSpread')}Y`}
                name={'positionSpreadY'}
                value={positionSpreadY}
                onChange={this.handleChangePosition}
            />
            <NumberProperty label={`${_t('PositionSpread')}Z`}
                name={'positionSpreadZ'}
                value={positionSpreadZ}
                onChange={this.handleChangePosition}
            />

            <NumberProperty label={`${_t('Velocity')}X`}
                name={'velocityX'}
                value={velocityX}
                onChange={this.handleChangeVelocity}
            />
            <NumberProperty label={`${_t('Velocity')}Y`}
                name={'velocityY'}
                value={velocityY}
                onChange={this.handleChangeVelocity}
            />
            <NumberProperty label={`${_t('Velocity')}Z`}
                name={'velocityZ'}
                value={velocityZ}
                onChange={this.handleChangeVelocity}
            />
            <NumberProperty label={`${_t('VelocitySpread')}X`}
                name={'velocitySpreadX'}
                value={velocitySpreadX}
                onChange={this.handleChangeVelocity}
            />
            <NumberProperty label={`${_t('VelocitySpread')}Y`}
                name={'velocitySpreadY'}
                value={velocitySpreadY}
                onChange={this.handleChangeVelocity}
            />
            <NumberProperty label={`${_t('VelocitySpread')}Z`}
                name={'velocitySpreadZ'}
                value={velocitySpreadZ}
                onChange={this.handleChangeVelocity}
            />

            <NumberProperty label={`${_t('Acceleration')}X`}
                name={'accelerationX'}
                value={accelerationX}
                onChange={this.handleChangeAcceleration}
            />
            <NumberProperty label={`${_t('Acceleration')}Y`}
                name={'accelerationY'}
                value={accelerationY}
                onChange={this.handleChangeAcceleration}
            />
            <NumberProperty label={`${_t('Acceleration')}Z`}
                name={'accelerationZ'}
                value={accelerationZ}
                onChange={this.handleChangeAcceleration}
            />
            <NumberProperty label={`${_t('AccelerationSpread')}X`}
                name={'accelerationSpreadX'}
                value={accelerationSpreadX}
                onChange={this.handleChangeAcceleration}
            />
            <NumberProperty label={`${_t('AccelerationSpread')}Y`}
                name={'accelerationSpreadY'}
                value={accelerationSpreadY}
                onChange={this.handleChangeAcceleration}
            />
            <NumberProperty label={`${_t('AccelerationSpread')}Z`}
                name={'accelerationSpreadZ'}
                value={accelerationSpreadZ}
                onChange={this.handleChangeAcceleration}
            />

            <ColorProperty label={`${_t('Color')}1`}
                name={'color1'}
                value={color1}
                onChange={this.handleChangeColor}
            />
            <ColorProperty label={`${_t('Color')}2`}
                name={'color2'}
                value={color2}
                onChange={this.handleChangeColor}
            />
            <ColorProperty label={`${_t('Color')}3`}
                name={'color3'}
                value={color3}
                onChange={this.handleChangeColor}
            />
            <ColorProperty label={`${_t('Color')}4`}
                name={'color4'}
                value={color4}
                onChange={this.handleChangeColor}
            />

            <NumberProperty label={`${_t('Size')}`}
                name={'size'}
                value={size}
                onChange={this.handleChangeSize}
            />
            <NumberProperty label={`${_t('SizeSpread')}`}
                name={'sizeSpread'}
                value={sizeSpread}
                onChange={this.handleChangeSize}
            />

            <TextureProperty label={`${_t('Texture')}`}
                name={'texture'}
                value={texture}
                onChange={this.handleChangeTexture}
            />

            <IntegerProperty label={`${_t('ParticleCount')}`}
                name={'particleCount'}
                value={particleCount}
                onChange={this.handleChangeParticleCount}
            />
            <NumberProperty label={`${_t('MaxAge')}`}
                name={'maxAge'}
                value={maxAge}
                onChange={this.handleChangeMaxAge}
            />
            <NumberProperty label={`${_t('maxAgeSpread')}`}
                name={'maxAgeSpread'}
                value={maxAgeSpread}
                onChange={this.maxAgeSpread}
            />

            <ButtonProperty text={previewText}
                onChange={this.handlePreview}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.ParticleEmitterComponent`, this.handleUpdate);
        app.on(`objectChanged.ParticleEmitterComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.userData.type === 'ParticleEmitter')) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        let group = this.selected.userData.group;
        let emitter = group.emitters[0];

        let state = {
            show: true,

            positionX: emitter.position.value.x,
            positionY: emitter.position.value.y,
            positionZ: emitter.position.value.z,

            positionSpreadX: emitter.position.spread.x,
            positionSpreadY: emitter.position.spread.y,
            positionSpreadZ: emitter.position.spread.z,

            velocityX: emitter.velocity.value.x,
            velocityY: emitter.velocity.value.y,
            velocityZ: emitter.velocity.value.z,

            velocitySpreadX: emitter.velocity.spread.x,
            velocitySpreadY: emitter.velocity.spread.y,
            velocitySpreadZ: emitter.velocity.spread.z,

            accelerationX: emitter.acceleration.value.x,
            accelerationY: emitter.acceleration.value.y,
            accelerationZ: emitter.acceleration.value.z,

            accelerationSpreadX: emitter.acceleration.spread.x,
            accelerationSpreadY: emitter.acceleration.spread.y,
            accelerationSpreadZ: emitter.acceleration.spread.z,

            color1: `#${emitter.color.value[0].getHexString()}`,
            color2: `#${emitter.color.value[1].getHexString()}`,
            color3: `#${emitter.color.value[2].getHexString()}`,
            color4: `#${emitter.color.value[3].getHexString()}`,

            size: emitter.size.value[0],
            sizeSpread: emitter.size.spread[0],
            texture: group.texture,
            particleCount: emitter.particleCount,
            maxAge: emitter.maxAge.value,
            maxAgeSpread: emitter.maxAge.spread,

            previewText: this.isPlaying ? _t('Cancel') : _t('Preview')
        };

        this.setState(state);
    }

    handleChangePosition(value, name) {
        this.setState({
            [name]: value
        });

        if (value === null) {
            return;
        }

        const { positionX, positionY, positionZ, positionSpreadX, positionSpreadY, positionSpreadZ } = Object.assign({}, this.state, {
            [name]: value
        });

        let group = this.selected.userData.group;
        let emitter = group.emitters[0];

        emitter.position.value.x = positionX;
        emitter.position.value.y = positionY;
        emitter.position.value.z = positionZ;

        emitter.position.spread.x = positionSpreadX;
        emitter.position.spread.y = positionSpreadY;
        emitter.position.spread.z = positionSpreadZ;

        emitter.updateFlags.position = true;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeVelocity(value, name) {
        this.setState({
            [name]: value
        });

        if (value === null) {
            return;
        }

        const { velocityX, velocityY, velocityZ, velocitySpreadX, velocitySpreadY, velocitySpreadZ } = Object.assign({}, this.selected, {
            [name]: value
        });

        let group = this.selected.userData.group;
        let emitter = group.emitters[0];

        emitter.velocity.value.x = velocityX;
        emitter.velocity.value.y = velocityY;
        emitter.velocity.value.z = velocityZ;

        emitter.velocity.spread.x = velocitySpreadX;
        emitter.velocity.spread.y = velocitySpreadY;
        emitter.velocity.spread.z = velocitySpreadZ;

        emitter.updateFlags.velocity = true;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeAcceleration(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { accelerationX, accelerationY, accelerationZ, accelerationSpreadX, accelerationSpreadY, accelerationSpreadZ } = Object.assign({}, this.state, {
            [name]: value
        });

        let group = this.selected.userData.group;
        let emitter = group.emitters[0];

        emitter.acceleration.value.x = accelerationX;
        emitter.acceleration.value.y = accelerationY;
        emitter.acceleration.value.z = accelerationZ;

        emitter.acceleration.spread.x = accelerationSpreadX;
        emitter.acceleration.spread.y = accelerationSpreadY;
        emitter.acceleration.spread.z = accelerationSpreadZ;

        emitter.updateFlags.acceleration = true;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeColor(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { color1, color2, color3, color4 } = Object.assign({}, this.state, {
            [name]: value
        });

        let group = this.selected.userData.group;
        let emitter = group.emitters[0];

        emitter.color.value[0] = new THREE.Color(color1);
        emitter.color.value[1] = new THREE.Color(color2);
        emitter.color.value[2] = new THREE.Color(color3);
        emitter.color.value[3] = new THREE.Color(color4);

        emitter.updateFlags.color = true;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeSize(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { size, sizeSpread } = Object.assign({}, this.state, {
            [name]: value
        });

        let group = this.selected.userData.group;
        let emitter = group.emitters[0];

        for (var i = 0; i < emitter.size.value.length; i++) {
            emitter.size.value[i] = size;
            emitter.size.spread[i] = sizeSpread;
        }

        emitter.updateFlags.size = true;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeTexture(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { texture } = Object.assign({}, this.state, {
            [name]: value
        });

        let group = this.selected.userData.group;

        texture.needsUpdate = true;

        group.texture = texture;
        group.material.uniforms.texture.value = texture;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeParticleCount(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { particleCount } = Object.assign({}, this.state, {
            [name]: value
        });

        let group = this.selected.userData.group;
        let emitter = group.emitters[0];

        emitter.particleCount = particleCount;

        emitter.updateFlags.params = true;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeMaxAge(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { maxAge } = Object.assign({}, this.state, {
            [name]: value
        });

        let group = this.selected.userData.group;
        let emitter = group.emitters[0];

        emitter.maxAge.value = maxAge;

        emitter.updateFlags.params = true;

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeMaxAgeSpread(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { maxAgeSpread } = Object.assign({}, this.state, {
            [name]: value
        });

        let group = this.selected.userData.group;
        let emitter = group.emitters[0];

        emitter.maxAge.spread = maxAgeSpread;

        emitter.updateFlags.params = true;

        app.call(`objectChanged`, this, this.selected);
    }

    handlePreview() {
        if (this.isPlaying) {
            this.stopPreview();
        } else {
            this.startPreview();
        }
    }

    startPreview() {
        this.isPlaying = true;

        this.setState({
            previewText: _t('Cancel')
        });

        app.on(`animate.ParticleEmitterComponent`, this.onAnimate);
    }

    stopPreview() {
        this.isPlaying = false;

        this.setState({
            previewText: _t('Preview')
        });

        let group = this.selected.userData.group;
        let emitter = this.selected.userData.emitter;

        group.removeEmitter(emitter);
        group.addEmitter(emitter);
        group.tick(0);

        app.on(`animate.ParticleEmitterComponent`, null);
    }

    onAnimate(clock, deltaTime) {
        let group = this.selected.userData.group;

        group.tick(deltaTime);
    }
}

export default ParticleEmitterComponent;