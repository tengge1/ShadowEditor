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
 * 环面纽结组件
 * @author tengge / https://github.com/tengge1
 */
class TorusKnotGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            radius: 1,
            tube: 1,
            tubularSegments: 16,
            radialSegments: 16,
            p: 20,
            q: 20
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, radius, tube, tubularSegments, radialSegments, p, q } = this.state;

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
            <IntegerProperty name={'tubularSegments'}
                label={_t('TubelarSegments')}
                value={tubularSegments}
                onChange={this.handleChange}
            />
            <IntegerProperty name={'radialSegments'}
                label={_t('RadialSegments')}
                value={radialSegments}
                onChange={this.handleChange}
            />
            <NumberProperty name={'p'}
                label={_t('TubeArc')}
                value={p}
                onChange={this.handleChange}
            />
            <NumberProperty name={'q'}
                label={_t('DistortedArc')}
                value={q}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.TorusKnotGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.TorusKnotGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.TorusKnotBufferGeometry)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const { radius, tube, tubularSegments, radialSegments, p, q } = Object.assign({}, this.selected.geometry.parameters);

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            radius: radius === undefined ? 1 : radius,
            tube: tube === undefined ? 0.4 : tube,
            tubularSegments: tubularSegments === undefined ? 64 : tubularSegments,
            radialSegments: radialSegments === undefined ? 8 : radialSegments,
            p: p === undefined ? 2 : p,
            q: q === undefined ? 3 : q
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { radius, tube, tubularSegments, radialSegments, p, q } = Object.assign({}, this.state, {
            [name]: value
        });

        this.setState(state);

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.TorusKnotBufferGeometry(
            radius,
            tube,
            tubularSegments,
            radialSegments,
            p,
            q
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default TorusKnotGeometryComponent;