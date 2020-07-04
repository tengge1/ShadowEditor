/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, NumberProperty } from '../../../ui/index';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 二十面体组件
 * @author tengge / https://github.com/tengge1
 */
class IcosahedronGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            radius: 1.0,
            detail: 1.0
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, radius, detail } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Geometry Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty name={'radius'}
                label={_t('Radius')}
                value={radius}
                onChange={this.handleChange}
            />
            <NumberProperty name={'detail'}
                label={_t('Detail')}
                value={detail}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.IcosahedronGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.IcosahedronGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.IcosahedronBufferGeometry)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const { radius, detail } = Object.assign({}, this.selected.geometry.parameters);

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            radius: radius === undefined ? 1 : radius,
            detail: detail === undefined ? 0 : detail
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { radius, detail } = Object.assign({}, this.state, {
            [name]: value
        });

        this.setState(state);

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.IcosahedronBufferGeometry(
            radius,
            detail
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default IcosahedronGeometryComponent;