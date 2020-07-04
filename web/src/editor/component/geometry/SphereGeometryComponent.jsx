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
 * 球体组件
 * @author tengge / https://github.com/tengge1
 */
class SphereGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            radius: 1,
            widthSegments: 16,
            heightSegments: 16,
            phiStart: 0,
            phiLength: Math.PI * 2,
            thetaStart: 0,
            thetaLength: Math.PI / 2
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength } = this.state;

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
            <IntegerProperty name={'widthSegments'}
                label={_t('WidthSegments')}
                value={widthSegments}
                onChange={this.handleChange}
            />
            <IntegerProperty name={'heightSegments'}
                label={_t('HeightSegments')}
                value={heightSegments}
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
        app.on(`objectSelected.SphereGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.SphereGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.SphereBufferGeometry)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const { radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength } = Object.assign({},
            this.selected.geometry.parameters);

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            radius: radius === undefined ? 1 : radius,
            widthSegments: widthSegments === undefined ? 8 : widthSegments,
            heightSegments: heightSegments === undefined ? 6 : heightSegments,
            phiStart: phiStart === undefined ? 0 : phiStart,
            phiLength: phiLength === undefined ? Math.PI * 2 : phiLength,
            thetaStart: thetaStart === undefined ? 0 : thetaStart,
            thetaLength: thetaLength === undefined ? Math.PI : thetaLength
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength } = Object.assign({}, this.state, {
            [name]: value
        });

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.SphereBufferGeometry(
            radius,
            widthSegments,
            heightSegments,
            phiStart,
            phiLength,
            thetaStart,
            thetaLength
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default SphereGeometryComponent;