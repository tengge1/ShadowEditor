/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, SelectProperty } from '../../../ui/index';

/**
 * 场景控制器组件
 * @author tengge / https://github.com/tengge1
 */
class ControlComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.type = {
            '': _t('None'),
            'FirstPersonControls': _t('First Person Controls'),
            'FlyControls': _t('Fly Controls'),
            'OrbitControls': _t('Orbit Controls'),
            'PointerLockControls': _t('Pointer Lock Controls'),
            'TrackballControls': _t('Traceball Controls')
        };

        this.state = {
            show: false,
            expanded: true,
            type: ''
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, type } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Scene Controller')}
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
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.ControlComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.ControlComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.camera) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            type: this.selected.userData.control || ''
        });
    }

    handleChange(value, name) {
        const { type } = Object.assign({}, this.state, {
            [name]: value
        });

        this.selected.userData.control = type;

        app.call('objectChanged', this, this.selected);
    }
}

export default ControlComponent;