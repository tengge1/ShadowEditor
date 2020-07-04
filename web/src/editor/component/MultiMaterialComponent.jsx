/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, SelectProperty, DisplayProperty } from '../../ui/index';

/**
 * 多材质组件
 * @author tengge / https://github.com/tengge1
 */
class MultiMaterialComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            count: 0,
            materials: [],
            index: 0
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, count, materials, index } = this.state;

        if (!show) {
            return null;
        }

        let _materials = {};

        materials.forEach((n, i) => {
            _materials[i] = n.name || (i + 1).toString();
        });

        return <PropertyGroup title={_t('MultiMaterial Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <DisplayProperty label={_t('Count')}
                value={count.toString()}
            />
            <SelectProperty label={_t('Material')}
                options={_materials}
                name={'index'}
                value={index === -1 ? undefined : index}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.MultiMaterialComponent`, this.handleUpdate);
        app.on(`objectChanged.MultiMaterialComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !Array.isArray(editor.selected.material)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;
        const materials = this.selected.material;
        const index = 0;
        const current = materials[index];

        app.call(`currentMaterialChange`, this, current, index, materials, this.selected);

        let state = {
            show: true,
            count: materials.length,
            materials,
            index
        };

        this.setState(state);
    }

    handleChange(value, name) {
        const materials = this.state.materials;
        const index = parseInt(value);
        const current = materials[index];

        app.call(`currentMaterialChange`, this, current, index, materials, this.selected);

        this.setState({
            [name]: value
        });
    }
}

export default MultiMaterialComponent;