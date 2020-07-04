/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { PropertyGroup, NumberProperty } from '../../../ui/index';
import Sky from '../../../object/component/Sky';

/**
 * 天空组件
 * @author tengge / https://github.com/tengge1
 */
class SkyComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            turbidity: 10,
            rayleigh: 2,
            luminance: 1,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.005
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, turbidity, rayleigh, luminance, mieCoefficient, mieDirectionalG } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Sky')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               >
            <NumberProperty label={_t('Turbidity')}
                name={'turbidity'}
                value={turbidity}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Rayleigh')}
                name={'rayleigh'}
                value={rayleigh}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('Luminance')}
                name={'luminance'}
                value={luminance}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('MieCofficient')}
                name={'mieCoefficient'}
                value={mieCoefficient}
                onChange={this.handleChange}
            />
            <NumberProperty label={_t('MieDirectionalG')}
                name={'mieDirectionalG'}
                value={mieDirectionalG}
                onChange={this.handleChange}
            />
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.SkyComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.SkyComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof Sky)) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            turbidity: this.selected.userData.turbidity,
            rayleigh: this.selected.userData.rayleigh,
            luminance: this.selected.userData.luminance,
            mieCoefficient: this.selected.userData.mieCoefficient * 100,
            mieDirectionalG: this.selected.userData.mieDirectionalG
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { turbidity, rayleigh, luminance, mieCoefficient, mieDirectionalG } = Object.assign({}, this.state, {
            [name]: value
        });

        Object.assign(this.selected.userData, {
            turbidity,
            rayleigh,
            luminance,
            mieCoefficient: mieCoefficient / 100,
            mieDirectionalG
        });

        const sky = this.selected.children.filter(n => n instanceof THREE.Sky)[0];

        if (sky) {
            let uniforms = sky.material.uniforms;

            uniforms.turbidity.value = turbidity;
            uniforms.rayleigh.value = rayleigh;
            uniforms.luminance.value = luminance;
            uniforms.mieCoefficient.value = mieCoefficient / 100;
            uniforms.mieDirectionalG.value = mieDirectionalG;

            sky.material.needsUpdate = true;
        }

        app.call(`objectChanged`, this, this.selected);
    }
}

export default SkyComponent;