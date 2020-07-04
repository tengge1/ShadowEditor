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
 * 茶壶组件
 * @author tengge / https://github.com/tengge1
 */
class TeapotGeometryComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            size: 3,
            segments: 10,
            bottom: true,
            lid: true,
            body: true,
            fitLid: true,
            blinn: true
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, size, segments, bottom, lid, body, fitLid, blinn } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Geometry Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty name={'size'}
                label={_t('Size')}
                value={size}
                onChange={this.handleChange}
            />
            <IntegerProperty name={'segments'}
                label={_t('Segments')}
                value={segments}
                onChange={this.handleChange}
            />
            <CheckBoxProperty name={'bottom'}
                label={_t('Bottom')}
                value={bottom}
                onChange={this.handleChange}
            />
            <CheckBoxProperty name={'lid'}
                label={_t('Lid')}
                value={lid}
                onChange={this.handleChange}
            />
            <CheckBoxProperty name={'body'}
                label={_t('Body')}
                value={body}
                onChange={this.handleChange}
            />
            <CheckBoxProperty name={'fitLid'}
                label={_t('FitLid')}
                value={fitLid}
                onChange={this.handleChange}
            />
            <CheckBoxProperty name={'blinn'}
                label={_t('Blinn')}
                value={blinn}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.TeapotGeometryComponent`, this.handleUpdate);
        app.on(`objectChanged.TeapotGeometryComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh) || !(editor.selected.geometry instanceof THREE.TeapotBufferGeometry)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        const { size, segments, bottom, lid, body, fitLid, blinn } = Object.assign({}, this.selected.geometry.parameters);

        this.setState({
            show: true,
            type: this.selected.geometry.constructor.name,
            size: size === undefined ? 50 : size,
            segments: segments === undefined ? 10 : segments,
            bottom: bottom === undefined ? true : bottom,
            lid: lid === undefined ? true : lid,
            body: body === undefined ? true : body,
            fitLid: fitLid === undefined ? true : fitLid,
            blinn: blinn === undefined ? true : blinn
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { size, segments, bottom, lid, body, fitLid, blinn } = Object.assign({}, this.state, {
            [name]: value
        });

        let geometry = new THREE.TeapotBufferGeometry(size, segments, bottom, lid, body, fitLid, blinn);

        geometry.type = 'TeapotBufferGeometry';

        geometry.parameters = { size, segments, bottom, lid, body, fitLid, blinn };

        app.editor.execute(new SetGeometryCommand(this.selected, geometry));

        app.call(`objectChanged`, this, this.selected);
    }
}

export default TeapotGeometryComponent;