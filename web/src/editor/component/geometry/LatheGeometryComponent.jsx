/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, NumberProperty, IntegerProperty } from '../../../ui/index';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 车床组件
 * @author tengge / https://github.com/tengge1
 */
class LatheGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            segments: 16,
            phiStart: 0.0,
            phiLength: Math.PI * 2
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, segments, phiStart, phiLength } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Geometry Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <IntegerProperty name={'segments'}
                label={_t('RadialSegments')}
                value={segments}
                onChange={this.handleChange}
            />
            <NumberProperty name={'phiStart'}
                label={_t('PhiStart')}
                value={phiStart}
                onChange={this.handleChange}
            />
            <NumberProperty name={'phiLength'}
                label={_t('PhiLength')}
                value={phiLength}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.LatheGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.LatheGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.LatheBufferGeometry)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const { segments, phiStart, phiLength } = Object.assign({}, this.selected.geometry.parameters);

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            segments: segments === undefined ? 12 : segments,
            phiStart: phiStart === undefined ? 0 : phiStart,
            phiLength: phiLength === undefined ? Math.PI * 2 : phiLength
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { segments, phiStart, phiLength } = Object.assign({}, this.state, {
            [name]: value
        });

        const points = this.selected.geometry.parameters.points;

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.LatheBufferGeometry(
            points,
            segments,
            phiStart,
            phiLength
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default LatheGeometryComponent;