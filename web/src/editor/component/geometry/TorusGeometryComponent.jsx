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
 * 花托组件
 * @author tengge / https://github.com/tengge1
 */
class TorusGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            radius: 1,
            tube: 1,
            radialSegments: 16,
            tubularSegments: 16,
            arc: Math.PI * 2
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, radius, tube, radialSegments, tubularSegments, arc } = this.state;

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
            <NumberProperty name={'tube'}
                label={_t('Tube')}
                value={tube}
                onChange={this.handleChange}
            />
            <IntegerProperty name={'radialSegments'}
                label={_t('RadialSegments')}
                value={radialSegments}
                onChange={this.handleChange}
            />
            <IntegerProperty name={'tubularSegments'}
                label={_t('TubelarSegments')}
                value={tubularSegments}
                onChange={this.handleChange}
            />
            <NumberProperty name={'arc'}
                label={_t('Arc')}
                value={arc}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.TorusGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.TorusGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.TorusBufferGeometry)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const { radius, tube, radialSegments, tubularSegments, arc } = Object.assign({}, this.selected.geometry.parameters);

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            radius: radius === undefined ? 1 : radius,
            tube: tube === undefined ? 0.4 : tube,
            radialSegments: radialSegments === undefined ? 8 : radialSegments,
            tubularSegments: tubularSegments === undefined ? 16 : tubularSegments,
            arc: arc === undefined ? Math.PI * 2 : arc
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { radius, tube, radialSegments, tubularSegments, arc } = Object.assign({}, this.state, {
            [name]: value
        });

        this.setState(state);

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.TorusBufferGeometry(
            radius,
            tube,
            radialSegments,
            tubularSegments,
            arc
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default TorusGeometryComponent;