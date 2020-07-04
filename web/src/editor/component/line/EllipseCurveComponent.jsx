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
 * 椭圆曲线组件
 * @author tengge / https://github.com/tengge1
 */
class EllipseCurveComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            aX: 0,
            aY: 0,
            xRadius: 0,
            yRadius: 0,
            aStartAngle: 0,
            aEndAngle: 0,
            aClockwise: false,
            aRotation: 0
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Ellipse Curve')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty label={'Center X'}
                name={'aX'}
                value={aX}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Center Y'}
                name={'aY'}
                value={aY}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Radius X'}
                name={'xRadius'}
                value={xRadius}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Radius Y'}
                name={'yRadius'}
                value={yRadius}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Start Angle'}
                name={'aStartAngle'}
                value={aStartAngle}
                onChange={this.handleChange}
            />
            <NumberProperty label={'End Angle'}
                name={'aEndAngle'}
                value={aEndAngle}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={'Clockwise'}
                name={'aClockwise'}
                value={aClockwise}
                onChange={this.handleChange}
            />
            <NumberProperty label={'Rotation'}
                name={'aRotation'}
                value={aRotation}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.EllipseCurveComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.EllipseCurveComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected.userData.type !== 'EllipseCurve') {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            aX: this.selected.userData.aX,
            aY: this.selected.userData.aY,
            xRadius: this.selected.userData.xRadius,
            yRadius: this.selected.userData.yRadius,
            aStartAngle: this.selected.userData.aStartAngle,
            aEndAngle: this.selected.userData.aEndAngle,
            aClockwise: this.selected.userData.aClockwise,
            aRotation: this.selected.userData.aRotation
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation } = Object.assign({}, this.state, {
            [name]: value
        });

        Object.assign(this.selected.userData, {
            aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation
        });

        this.selected.update();

        app.call('objectChanged', this, this.selected);
    }
}

export default EllipseCurveComponent;