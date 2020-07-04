/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, DisplayProperty, ButtonProperty } from '../../../ui/index';

/**
 * BufferGeometry组件
 * @author tengge / https://github.com/tengge1
 */
class BufferGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            positionCount: 0,
            normalCount: 0,
            uvCount: 0,
            indexCound: 0
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleComputeVertexNormals = this.handleComputeVertexNormals.bind(this);
        // this.handleComputeFaceNormals = this.handleComputeFaceNormals.bind(this);
    }

    render() {
        const { show, expanded, positionCount, normalCount, uvCount, indexCound } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('BufferGeometry Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <DisplayProperty label={_t('Position Count')}
                value={positionCount.toString()}
            />
            <DisplayProperty label={_t('Normal Count')}
                value={normalCount.toString()}
            />
            <DisplayProperty label={_t('UV Count')}
                value={uvCount.toString()}
            />
            <DisplayProperty label={_t('Index Count')}
                value={indexCound.toString()}
            />
            <ButtonProperty text={_t('Compute Vertex Normals')}
                onChange={this.handleComputeVertexNormals}
            />
            {/* <ButtonProperty text={'Compute Face Normals'} onChange={this.handleComputeFaceNormals}></ButtonProperty> */}
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.BufferGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.BufferGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.BufferGeometry)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const geometry = this.selected.geometry;

        this.setState({
            show: true,
            positionCount: geometry.attributes.position ? geometry.attributes.position.count : 0,
            normalCount: geometry.attributes.normal ? geometry.attributes.normal.count : 0,
            uvCount: geometry.attributes.uv ? geometry.attributes.uv.count : 0,
            indexCound: geometry.index ? geometry.index.count : 0
        });
    }

    handleComputeVertexNormals() {
        const geometry = this.selected.geometry;
        if (!geometry) {
            return;
        }
        geometry.computeVertexNormals();
    }

    // computeFaceNormals被three.js移除了。
    // handleComputeFaceNormals() {
    //     const geometry = this.selected.geometry;
    //     if (!geometry) {
    //         return;
    //     }
    //     geometry.computeFaceNormals();
    // }
}

export default BufferGeometryComponent;