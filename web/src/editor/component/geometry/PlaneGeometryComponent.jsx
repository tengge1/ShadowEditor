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
 * 平板组件
 * @author tengge / https://github.com/tengge1
 */
class PlaneGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            width: 1,
            height: 1,
            widthSegments: 1,
            heightSegments: 1
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, width, height, widthSegments, heightSegments } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Geometry Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty name={'width'}
                label={_t('Width')}
                value={width}
                onChange={this.handleChange}
            />
            <NumberProperty name={'height'}
                label={_t('Height')}
                value={height}
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
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.PlaneGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.PlaneGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.PlaneBufferGeometry)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const { width, height, widthSegments, heightSegments } = Object.assign({}, this.selected.geometry.parameters);

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            width: width === undefined ? 1 : width,
            height: height === undefined ? 1 : height,
            widthSegments: widthSegments === undefined ? 1 : widthSegments,
            heightSegments: heightSegments === undefined ? 1 : heightSegments
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { width, height, widthSegments, heightSegments } = Object.assign({}, this.state, {
            [name]: value
        });

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.PlaneBufferGeometry(
            width,
            height,
            widthSegments,
            heightSegments
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default PlaneGeometryComponent;