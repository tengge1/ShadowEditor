/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, NumberProperty, SelectProperty } from '../../../ui/index';

/**
 * 物理环境组件
 * @author tengge / https://github.com/tengge1
 */
class PhysicsWorldComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.type = {
            'btDefaultCollisionConfiguration': _t('DefaultCollisionConfig'), // 无法使用布料
            'btSoftBodyRigidBodyCollisionConfiguration': _t('SoftBodyRigidBodyCollisionConfig')
        };

        this.state = {
            show: false,
            expanded: false,
            type: 'btSoftBodyRigidBodyCollisionConfiguration',
            gravityX: 0,
            gravityY: -9.8,
            gravityZ: 0
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, type, gravityX, gravityY, gravityZ } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('PhysicsEnvironment')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <SelectProperty label={_t('Type')}
                options={this.type}
                name={'type'}
                value={type}
                onChange={this.handleChange}
            />
            <NumberProperty label={'GravityX'}
                name={'gravityX'}
                value={gravityX}
                onChange={this.handleChange}
            />
            <NumberProperty label={'GravityY'}
                name={'gravityY'}
                value={gravityY}
                onChange={this.handleChange}
            />
            <NumberProperty label={'GravityZ'}
                name={'gravityZ'}
                value={gravityZ}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.PhysicsWorldComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.PhysicsWorldComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.scene) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        if (!this.selected.userData.physics) {
            this.selected.userData.physics = {
                type: 'btSoftBodyRigidBodyCollisionConfiguration',
                gravityX: 0.0,
                gravityY: -9.8,
                gravityZ: 0.0
            };
        }

        let { type, gravityX, gravityY, gravityZ } = this.selected.userData.physics;

        this.setState({
            show: true,
            type,
            gravityX,
            gravityY,
            gravityZ
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { type, gravityX, gravityY, gravityZ } = Object.assign({}, this.state, {
            [name]: value
        });

        this.selected.userData.physics = {
            type,
            gravityX,
            gravityY,
            gravityZ
        };

        app.call('objectChanged', this, this.selected);
    }
}

export default PhysicsWorldComponent;