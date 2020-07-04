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

/**
 * 三次贝塞尔曲线组件
 * @author tengge / https://github.com/tengge1
 */
class CubicBezierCurveComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            v0x: 0,
            v0y: 0,
            v0z: 0,
            v1x: 0,
            v1y: 0,
            v1z: 0,
            v2x: 0,
            v2y: 0,
            v2z: 0,
            v3x: 0,
            v3y: 0,
            v3z: 0
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('CubicBezier Curve')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty label={'Point1 X'}
                name={'v0x'}
                value={v0x}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Point1 Y'}
                name={'v0y'}
                value={v0y}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Point1 Z'}
                name={'v0z'}
                value={v0z}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Point2 X'}
                name={'v1x'}
                value={v1x}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Point2 Y'}
                name={'v1y'}
                value={v1y}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Point2 Z'}
                name={'v1z'}
                value={v1z}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Point3 X'}
                name={'v2x'}
                value={v2x}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Point3 Y'}
                name={'v2y'}
                value={v2y}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Point3 Z'}
                name={'v2z'}
                value={v2z}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Point4 X'}
                name={'v3x'}
                value={v3x}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Point4 Y'}
                name={'v3y'}
                value={v3y}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Point4 Z'}
                name={'v3z'}
                value={v3z}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.CubicBezierCurveComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.CubicBezierCurveComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected.userData.type !== 'CubicBezierCurve') {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        let points = this.selected.userData.points;

        this.setState({
            show: true,
            v0x: points[0].x,
            v0y: points[0].y,
            v0z: points[0].z,
            v1x: points[1].x,
            v1y: points[1].y,
            v1z: points[1].z,
            v2x: points[2].x,
            v2y: points[2].y,
            v2z: points[2].z,
            v3x: points[3].x,
            v3y: points[3].y,
            v3z: points[3].z
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z, v3x, v3y, v3z } = Object.assign({}, this.state, {
            [name]: value
        });

        this.selected.userData.points = [
            new THREE.Vector3(v0x, v0y, v0z),
            new THREE.Vector3(v1x, v1y, v1z),
            new THREE.Vector3(v2x, v2y, v2z),
            new THREE.Vector3(v3x, v3y, v3z)
        ];

        this.selected.update();

        app.call('objectChanged', this, this.selected);
    }
}

export default CubicBezierCurveComponent;