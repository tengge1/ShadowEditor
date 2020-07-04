/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, CheckBoxProperty, NumberProperty, SelectProperty, ColorProperty } from '../../ui/index';

/**
 * 反光组件
 * @author tengge / https://github.com/tengge1
 */
class ReflectorComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.sizes = {
            '512': '512*512',
            '1024': '1024*1024',
            '2048': '2048*2048'
        };

        this.state = {
            show: false,
            expanded: false,

            reflect: false,
            showColor: false,
            color: '#ffffff',
            showSize: false,
            size: '1024',
            showClipBias: false,
            clipBias: 0,
            showRecursion: false,
            recursion: false
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, reflect, showColor, color, showSize, size, showClipBias, clipBias, showRecursion, recursion } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Reflector Component')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <CheckBoxProperty label={_t('Reflect')}
                name={'reflect'}
                value={reflect}
                onChange={this.handleChange}
            />
            <ColorProperty label={_t('Color')}
                name={'color'}
                value={color}
                show={showColor}
                onChange={this.handleChange}
            />
            <SelectProperty label={_t('TextureSize')}
                name={'size'}
                options={this.sizes}
                value={size}
                show={showSize}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('ClipBias')}
                name={'clipBias'}
                value={clipBias}
                show={showClipBias}
                onChange={this.handleChange}
            />
            <CheckBoxProperty label={_t('Recursion')}
                name={'recursion'}
                value={recursion}
                show={showRecursion}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.ReflectorComponent`, this.handleUpdate);
        app.on(`objectChanged.ReflectorComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        let state = {
            show: true
        };

        if (this.selected instanceof THREE.Reflector) {
            Object.assign(state, {
                reflect: true,
                showColor: true,
                color: this.selected.userData.color,
                showSize: true,
                size: this.selected.userData.size,
                showClipBias: true,
                clipBias: this.selected.userData.clipBias,
                showRecursion: true,
                recursion: this.selected.userData.recursion
            });
        } else {
            Object.assign(state, {
                reflect: false,
                showColor: false,
                showSize: false,
                showClipBias: false,
                showRecursion: false
            });
        }

        this.setState(state);
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { reflect, color, size, clipBias, recursion } = Object.assign({}, this.state, {
            [name]: value
        });

        let editor = app.editor;

        if (reflect) {
            let reflector = new THREE.Reflector(this.selected.geometry, {
                color: color,
                textureWidth: parseInt(size),
                textureHeight: parseInt(size),
                clipBias: clipBias,
                recursion: recursion ? 1 : 0
            });

            reflector.name = this.selected.name;

            reflector.position.copy(this.selected.position);
            reflector.rotation.copy(this.selected.rotation);
            reflector.scale.copy(this.selected.scale);
            reflector.castShadow = this.selected.castShadow;
            reflector.receiveShadow = this.selected.receiveShadow;

            if (this.selected instanceof THREE.Reflector) {
                Object.assign(reflector.userData, this.selected.userData);
            } else {
                Object.assign(reflector.userData, this.selected.userData, {
                    mesh: this.selected
                });
            }

            reflector.userData.color = color;
            reflector.userData.size = size;
            reflector.userData.clipBias = clipBias;
            reflector.userData.recursion = recursion;

            var index = editor.scene.children.indexOf(this.selected);
            if (index > -1) {
                editor.scene.children[index] = reflector;
                reflector.parent = this.selected.parent;
                editor.select(null);
                this.selected.parent = null;
                app.call(`objectRemoved`, this, this.selected);
                app.call(`objectAdded`, this, reflector);
                editor.select(reflector);
            }
        } else {
            if (this.selected instanceof THREE.Reflector) {
                let mesh = this.selected.userData.mesh;
                this.selected.userData.mesh = null;

                mesh.name = this.selected.name;
                mesh.position.copy(this.selected.position);
                mesh.rotation.copy(this.selected.rotation);
                mesh.scale.copy(this.selected.scale);
                mesh.castShadow = this.selected.castShadow;
                mesh.receiveShadow = this.selected.receiveShadow;

                if (!Array.isArray(mesh.material) && mesh.material.color) {
                    mesh.material.color = new THREE.Color(color);
                }

                Object.assign(mesh.userData, this.selected.userData);

                let index = editor.scene.children.indexOf(this.selected);

                if (index > -1) {
                    editor.scene.children[index] = mesh;
                    mesh.parent = this.selected.parent;
                    this.selected.parent = null;
                    app.call(`objectRemoved`, this, this.selected);
                    app.call(`objectAdded`, this, mesh);
                    editor.select(mesh);
                }
            }
        }
    }
}

export default ReflectorComponent;