/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/RendererPanel.css';
import {Form, FormControl, Input, Label, Select} from '../../../../ui/index';
import global from '../../../../global';

/**
 * 渲染器窗口
 * @author tengge / https://github.com/tengge1
 */
class RendererPanel extends React.Component {
    constructor(props) {
        super(props);

        this.shadowMapType = {
            [-1]: _t('Disabled'),
            [THREE.BasicShadowMap]: _t('Basic Shadow'), // 0
            [THREE.PCFShadowMap]: _t('PCF Shadow'), // 1
            [THREE.PCFSoftShadowMap]: _t('PCF Soft Shadow') // 2
        };

        this.state = {
            shadowMapType: -1,
            // gammaInput: false,
            // gammaOutput: false,
            gammaFactor: 0
        };

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const {shadowMapType, gammaFactor} = this.state;

        return <Form className={'RendererPanel'}>
            <FormControl>
                <Label>{_t('Shadow')}</Label>
                <Select options={this.shadowMapType}
                        name={'shadowMapType'}
                        value={shadowMapType}
                        onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Gamma Factor')}</Label>
                <Input type={'number'}
                       name={'gammaFactor'}
                       value={gammaFactor}
                       onChange={this.handleChange}
                />
            </FormControl>
        </Form>;
    }

    componentDidMount() {
        global.app.on(`rendererChanged.RendererPanel`, this.handleUpdate);
    }

    handleUpdate() {
        const renderer = global.app.editor.renderer;

        this.setState({
            shadowMapType: renderer.shadowMap.enabled ? renderer.shadowMap.type : -1,
            gammaFactor: renderer.gammaFactor
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const scene = global.app.editor.scene;
        const camera = global.app.editor.camera;
        const renderer = global.app.editor.renderer;

        const {shadowMapType, gammaFactor} = Object.assign({}, this.state, {
            [name]: value
        });

        if (shadowMapType === '-1') {
            renderer.shadowMap.enabled = false;
        } else {
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = parseInt(shadowMapType);
        }

        renderer.gammaFactor = gammaFactor;

        // TODO: better implementation to reset renderState
        const fakeLight = new THREE.DirectionalLight();
        scene.add(fakeLight);
        renderer.compile(scene, camera);
        scene.remove(fakeLight);

        Object.assign(global.app.options, {
            shadowMapType,
            gammaFactor
        });

        global.app.call(`rendererChanged`, this);
    }
}

export default RendererPanel;