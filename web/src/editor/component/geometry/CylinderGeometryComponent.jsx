/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../ui/index';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 圆柱组件
 * @author tengge / https://github.com/tengge1
 */
class CylinderGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            radiusTop: 1.0,
            radiusBottom: 1.0,
            height: 1.0,
            radialSegments: 16,
            heightSegments: 1,
            openEnded: false,
            thetaStart: 0,
            thetaLength: Math.PI * 2
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Geometry Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty name={'radiusTop'}
                label={_t('RadiusTop')}
                value={radiusTop}
                onChange={this.handleChange}
            />
            <NumberProperty name={'radiusBottom'}
                label={_t('RadiusBottom')}
                value={radiusBottom}
                onChange={this.handleChange}
            />
            <NumberProperty name={'height'}
                label={_t('Height')}
                value={height}
                onChange={this.handleChange}
            />
            <IntegerProperty name={'radialSegments'}
                label={_t('RadialSegments')}
                value={radialSegments}
                onChange={this.handleChange}
            />
            <IntegerProperty name={'heightSegments'}
                label={_t('HeightSegments')}
                value={heightSegments}
                onChange={this.handleChange}
            />
            <CheckBoxProperty name={'openEnded'}
                label={_t('OpenEnded')}
                value={openEnded}
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
        app.on(`objectSelected.CylinderGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.CylinderGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.CylinderBufferGeometry)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const { radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength } = Object.assign({},
            this.selected.geometry.parameters);

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            radiusTop: radiusTop === undefined ? 1 : radiusTop,
            radiusBottom: radiusBottom === undefined ? 1 : radiusBottom,
            height: height === undefined ? 1 : height,
            radialSegments: radialSegments === undefined ? 8 : radialSegments,
            heightSegments: heightSegments === undefined ? 1 : heightSegments,
            openEnded: openEnded === undefined ? false : openEnded,
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

        const { radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength } = Object.assign({}, this.state, {
            [name]: value
        });

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.CylinderBufferGeometry(
            radiusTop,
            radiusBottom,
            height,
            radialSegments,
            heightSegments,
            openEnded,
            thetaStart,
            thetaLength
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default CylinderGeometryComponent;