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
 * 圆形组件
 * @author tengge / https://github.com/tengge1
 */
class CircleGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            radius: 1.0,
            segments: 16,
            thetaStart: 0.0,
            thetaLength: Math.PI * 2
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, radius, segments, thetaStart, thetaLength } = this.state;

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
            <IntegerProperty name={'segments'}
                label={_t('Segments')}
                value={segments}
                onChange={this.handleChange}
            />
            <NumberProperty name={'thetaStart'}
                label={_t('ThetaStart')}
                value={thetaStart}
                onChange={this.handleChange}
            />
            <NumberProperty name={'thetaLength'}
                label={_t('ThetaLength')}
                value={thetaLength}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.CircleGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.CircleGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.CircleBufferGeometry)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const { radius, segments, thetaStart, thetaLength } = Object.assign({},
            this.selected.geometry.parameters);

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            radius: radius === undefined ? 1 : radius,
            segments: segments === undefined ? 8 : segments,
            thetaStart: thetaStart === undefined ? 0 : thetaStart,
            thetaLength: thetaLength === undefined ? Math.PI * 2 : thetaLength
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { radius, segments, thetaStart, thetaLength } = Object.assign({}, this.state, {
            [name]: value
        });

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.CircleBufferGeometry(
            radius,
            segments,
            thetaStart,
            thetaLength
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default CircleGeometryComponent;