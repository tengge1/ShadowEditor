/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, CheckBoxProperty, NumberProperty } from '../../../ui/index';

/**
 * 音频监听器组件
 * @author tengge / https://github.com/tengge1
 */
class FlyControlComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            movementSpeed: 10.0,
            rollSpeed: 0.05,
            dragToLook: false,
            autoForward: false
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, movementSpeed, rollSpeed, dragToLook, autoForward } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Fly Controls')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty label={_t('MovementSpeed')}
                name={'movementSpeed'}
                value={movementSpeed}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('RotateSpeed')}
                name={'rollSpeed'}
                value={rollSpeed}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('DragToLook')}
                name={'dragToLook'}
                value={dragToLook}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('AutoForward')}
                name={'autoForward'}
                value={autoForward}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.FlyControlComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.FlyControlComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.camera || editor.selected.userData.control !== 'FlyControls') {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        if (this.selected.userData.flyOptions === undefined) {
            this.selected.userData.flyOptions = {
                movementSpeed: 20.0,
                rollSpeed: 0.2,
                dragToLook: false,
                autoForward: false
            };
        }

        this.setState({
            show: true,
            ...this.selected.userData.flyOptions
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { movementSpeed, rollSpeed, dragToLook, autoForward } = Object.assign({}, this.state, {
            [name]: value
        });

        Object.assign(this.selected.userData.flyOptions, {
            movementSpeed, rollSpeed, dragToLook, autoForward
        });

        app.call('objectChanged', this, this.selected);
    }
}

export default FlyControlComponent;