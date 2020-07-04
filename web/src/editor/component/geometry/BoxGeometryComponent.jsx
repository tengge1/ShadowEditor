/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, DisplayProperty, NumberProperty, IntegerProperty } from '../../../ui/index';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 正方体组件
 * @author tengge / https://github.com/tengge1
 */
class BoxGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            type: '',
            width: 1,
            height: 1,
            depth: 1,
            widthSegments: 1,
            heightSegments: 1,
            depthSegments: 1
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, type, width, height, depth, widthSegments, heightSegments, depthSegments } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Geometry Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <DisplayProperty label={_t('Type')}
                value={type}
            />
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
            <NumberProperty name={'depth'}
                label={_t('Depth')}
                value={depth}
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
            <IntegerProperty name={'depthSegments'}
                label={_t('DepthSegments')}
                value={depthSegments}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.BoxGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.BoxGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.BoxBufferGeometry)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const { width, height, depth, widthSegments, heightSegments, depthSegments } = Object.assign({},
            this.selected.geometry.parameters);

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            width: width === undefined ? 1 : width,
            height: height === undefined ? 1 : height,
            depth: depth === undefined ? 1 : depth,
            widthSegments: widthSegments === undefined ? 1 : widthSegments,
            heightSegments: heightSegments === undefined ? 1 : heightSegments,
            depthSegments: depthSegments === undefined ? 1 : depthSegments
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { width, height, depth, widthSegments, heightSegments, depthSegments } = Object.assign({}, this.state, {
            [name]: value
        });

        app.editor.execute(new SetGeometryCommand(this.selected, new THREE.BoxBufferGeometry(
            width,
            height,
            depth,
            widthSegments,
            heightSegments,
            depthSegments
        )));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default BoxGeometryComponent;