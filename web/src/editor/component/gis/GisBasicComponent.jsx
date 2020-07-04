/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, SelectProperty } from '../../../ui/index';

/**
 * GIS基本组件
 * @author tengge / https://github.com/tengge1
 */
class GisBasicComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.bakcground = {
            google: _t('Google Map'),
            bing: _t('Bing Map'),
            tianditu: _t('Tianditu Map')
        };

        this.state = {
            show: false,
            expanded: true,
            bakcground: 'google'
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, bakcground } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('GIS Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <SelectProperty label={_t('Map')}
                options={this.bakcground}
                name={'bakcground'}
                value={bakcground}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.GisBasicComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.GisBasicComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected.userData.type !== 'Globe') {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            bakcground: this.selected.getBackground()
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { bakcground } = Object.assign({}, this.state, {
            [name]: value
        });

        this.selected.setBackground(bakcground);

        app.call('objectChanged', this, this.selected);
    }
}

export default GisBasicComponent;