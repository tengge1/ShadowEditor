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
 * 第一视角控制器组件
 * @author tengge / https://github.com/tengge1
 */
class FirstPersonControlComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            movementSpeed: 10.0,
            lookSpeed: 0.05,
            lookVertical: true,
            autoForward: false,
            activeLook: true,
            heightSpeed: false,
            heightCoef: 1.0,
            heightMin: 0.0,
            heightMax: 1.0,
            constrainVertical: false,
            verticalMin: 0,
            verticalMax: 3.14
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, movementSpeed, lookSpeed, lookVertical, autoForward, activeLook, heightSpeed, heightCoef, heightMin, heightMax,
            constrainVertical, verticalMin, verticalMax } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('First Person Controls')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty label={_t('MovementSpeed')}
                name={'movementSpeed'}
                value={movementSpeed}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('LookSpeed')}
                name={'lookSpeed'}
                value={lookSpeed}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('LookVertical')}
                name={'lookVertical'}
                value={lookVertical}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('AutoForward')}
                name={'autoForward'}
                value={autoForward}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('ActiveLock')}
                name={'activeLook'}
                value={activeLook}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('HeightSpeed')}
                name={'heightSpeed'}
                value={heightSpeed}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('HeightCoef')}
                name={'heightCoef'}
                value={heightCoef}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('HeightMin')}
                name={'heightMin'}
                value={heightMin}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('HeightMax')}
                name={'heightMax'}
                value={heightMax}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('ConstrainVertical')}
                name={'constrainVertical'}
                value={constrainVertical}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('VerticalMin')}
                name={'verticalMin'}
                value={verticalMin}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('VerticalMax')}
                name={'verticalMax'}
                value={verticalMax}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.FirstPersonControlComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.FirstPersonControlComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.camera || editor.selected.userData.control !== 'FirstPersonControls') {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        if (this.selected.userData.firstPersonOptions === undefined) {
            this.selected.userData.firstPersonOptions = {
                movementSpeed: 10.0,
                lookSpeed: 0.05,
                lookVertical: true,
                autoForward: false,
                activeLook: true,
                heightSpeed: false,
                heightCoef: 1.0,
                heightMin: 0.0,
                heightMax: 1.0,
                constrainVertical: false,
                verticalMin: 0,
                verticalMax: 3.14
            };
        }

        this.setState({
            show: true,
            ...this.selected.userData.firstPersonOptions
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { movementSpeed, lookSpeed, lookVertical, autoForward, activeLook, heightSpeed, heightCoef, heightMin, heightMax,
            constrainVertical, verticalMin, verticalMax } = Object.assign({}, this.state, {
                [name]: value
            });

        Object.assign(this.selected.userData.firstPersonOptions, {
            movementSpeed, lookSpeed, lookVertical, autoForward, activeLook, heightSpeed, heightCoef, heightMin, heightMax,
            constrainVertical, verticalMin, verticalMax
        });

        app.call('objectChanged', this, this.selected);
    }
}

export default FirstPersonControlComponent;