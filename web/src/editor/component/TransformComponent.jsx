/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, CheckBoxProperty, NumberProperty } from '../../ui/index';
import SetPositionCommand from '../../command/SetPositionCommand';
import SetRotationCommand from '../../command/SetRotationCommand';
import SetScaleCommand from '../../command/SetScaleCommand';

/**
 * 位移组件
 * @author tengge / https://github.com/tengge1
 */
class TransformComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            positionX: 0.0,
            positionY: 0.0,
            positionZ: 0.0,
            rotationX: 0.0,
            rotationY: 0.0,
            rotationZ: 0.0,
            scaleX: 1.0,
            scaleY: 1.0,
            scaleZ: 1.0,
            scaleLocked: true
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChangePosition = this.handleChangePosition.bind(this);
        this.handleChangeRotation = this.handleChangeRotation.bind(this);
        this.handleChangeScale = this.handleChangeScale.bind(this);
        this.handleChangeScaleLock = this.handleChangeScaleLock.bind(this);
    }

    render() {
        const { show, expanded, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, scaleX, scaleY, scaleZ, scaleLocked } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Transform Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty name={'positionX'}
                label={`${_t('Translate')}X`}
                value={positionX}
                onChange={this.handleChangePosition}
            />
            <NumberProperty name={'positionY'}
                label={`${_t('Translate')}Y`}
                value={positionY}
                onChange={this.handleChangePosition}
            />
            <NumberProperty name={'positionZ'}
                label={`${_t('Translate')}Z`}
                value={positionZ}
                onChange={this.handleChangePosition}
            />
            <NumberProperty name={'rotationX'}
                label={`${_t('Rotate')}X`}
                value={rotationX}
                onChange={this.handleChangeRotation}
            />
            <NumberProperty name={'rotationY'}
                label={`${_t('Rotate')}Y`}
                value={rotationY}
                onChange={this.handleChangeRotation}
            />
            <NumberProperty name={'rotationZ'}
                label={`${_t('Rotate')}Z`}
                value={rotationZ}
                onChange={this.handleChangeRotation}
            />
            <NumberProperty name={'scaleX'}
                label={`${_t('Scale')}X`}
                value={scaleX}
                onChange={this.handleChangeScale}
            />
            <NumberProperty name={'scaleY'}
                label={`${_t('Scale')}Y`}
                value={scaleY}
                onChange={this.handleChangeScale}
            />
            <NumberProperty name={'scaleZ'}
                label={`${_t('Scale')}Z`}
                value={scaleZ}
                onChange={this.handleChangeScale}
            />
            <CheckBoxProperty name={'scaleLocked'}
                label={_t('Scale Locked')}
                value={scaleLocked}
                onChange={this.handleChangeScaleLock}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.TransformComponent`, this.handleUpdate);
        app.on(`objectChanged.TransformComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected === app.editor.scene || editor.selected.isGlobe) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            positionX: this.selected.position.x,
            positionY: this.selected.position.y,
            positionZ: this.selected.position.z,
            rotationX: this.selected.rotation.x * 180 / Math.PI,
            rotationY: this.selected.rotation.y * 180 / Math.PI,
            rotationZ: this.selected.rotation.z * 180 / Math.PI,
            scaleX: this.selected.scale.x,
            scaleY: this.selected.scale.y,
            scaleZ: this.selected.scale.z
        });
    }

    handleChangePosition(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { positionX, positionY, positionZ } = Object.assign({}, this.state, {
            [name]: value
        });

        app.editor.execute(new SetPositionCommand(this.selected, new THREE.Vector3(
            positionX,
            positionY,
            positionZ
        )));

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeRotation(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { rotationX, rotationY, rotationZ } = Object.assign({}, this.state, {
            [name]: value
        });

        app.editor.execute(new SetRotationCommand(this.selected, new THREE.Euler(
            rotationX * Math.PI / 180,
            rotationY * Math.PI / 180,
            rotationZ * Math.PI / 180
        )));

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeScale(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { scaleX, scaleY, scaleZ, scaleLocked } = Object.assign({}, this.state, {
            [name]: value
        });

        if (scaleLocked) {
            app.editor.execute(new SetScaleCommand(this.selected, new THREE.Vector3(value, value, value)));
        } else {
            app.editor.execute(new SetScaleCommand(this.selected, new THREE.Vector3(scaleX, scaleY, scaleZ)));
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeScaleLock(value) {
        this.setState({
            scaleLocked: value
        });
    }
}

export default TransformComponent;