/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/HelperPanel.css';
import { Form, FormControl, Label, CheckBox } from '../../../../ui/index';

/**
 * 帮助选项窗口
 * @author tengge / https://github.com/tengge1
 */
class HelperPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showGrid: false,
            showCamera: false,
            showPointLight: false,
            showDirectionalLight: false,
            showSpotLight: false,
            showHemisphereLight: false,
            showRectAreaLight: false,
            showSkeleton: false
        };

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { showGrid, showCamera, showPointLight, showDirectionalLight, showSpotLight, showHemisphereLight, showRectAreaLight, showSkeleton } = this.state;

        return <Form className={'HelperPanel'}>
            <FormControl>
                <Label>{_t('Grid')}</Label>
                <CheckBox name={'showGrid'}
                    checked={showGrid}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Camera')}</Label>
                <CheckBox name={'showCamera'}
                    checked={showCamera}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Point Light')}</Label>
                <CheckBox name={'showPointLight'}
                    checked={showPointLight}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Directional Light')}</Label>
                <CheckBox name={'showDirectionalLight'}
                    checked={showDirectionalLight}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Spot Light')}</Label>
                <CheckBox name={'showSpotLight'}
                    checked={showSpotLight}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Hemisphere Light')}</Label>
                <CheckBox name={'showHemisphereLight'}
                    checked={showHemisphereLight}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Rect Area Light')}</Label>
                <CheckBox name={'showRectAreaLight'}
                    checked={showRectAreaLight}
                    onChange={this.handleChange}
                />
            </FormControl>
            <FormControl>
                <Label>{_t('Skeleton')}</Label>
                <CheckBox name={'showSkeleton'}
                    checked={showSkeleton}
                    onChange={this.handleChange}
                />
            </FormControl>
        </Form>;
    }

    handleUpdate() {
        this.setState({
            showGrid: app.storage.showGrid,
            showCamera: app.storage.showCamera,
            showPointLight: app.storage.showPointLight,
            showDirectionalLight: app.storage.showDirectionalLight,
            showSpotLight: app.storage.showSpotLight,
            showHemisphereLight: app.storage.showHemisphereLight,
            showRectAreaLight: app.storage.showRectAreaLight,
            showSkeleton: app.storage.showSkeleton
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value
            });
            return;
        }

        const { showGrid, showCamera, showPointLight, showDirectionalLight,
            showSpotLight, showHemisphereLight, showRectAreaLight, showSkeleton } = Object.assign({}, this.state, {
                [name]: value
            });

        if (showGrid !== app.storage.showGrid) {
            app.storage.showGrid = showGrid;
        }

        if (showCamera !== app.storage.showCamera) {
            app.storage.showCamera = showCamera;
        }

        if (showPointLight !== app.storage.showPointLight) {
            app.storage.showPointLight = showPointLight;
        }

        if (showDirectionalLight !== app.storage.showDirectionalLight) {
            app.storage.showDirectionalLight = showDirectionalLight;
        }

        if (showSpotLight !== app.storage.showSpotLight) {
            app.storage.showSpotLight = showSpotLight;
        }

        if (showHemisphereLight !== app.storage.showHemisphereLight) {
            app.storage.showHemisphereLight = showHemisphereLight;
        }

        if (showRectAreaLight !== app.storage.showRectAreaLight) {
            app.storage.showRectAreaLight = showRectAreaLight;
        }

        if (showSkeleton !== app.storage.showSkeleton) {
            app.storage.showSkeleton = showSkeleton;
        }

        this.handleUpdate();
    }
}

export default HelperPanel;