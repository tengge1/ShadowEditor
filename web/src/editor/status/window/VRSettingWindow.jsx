/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/VRSettingWindow.css';
import { Window, Content, Buttons, Form, FormControl, Label, Input, Select, ImageUploader, Button, CheckBox } from '../../../ui/index';
import global from '../../../global';

/**
 * VR设置窗口
 * @author tengge / https://github.com/tengge1
 */
class VRSettingWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posX: 0,
            posY: 0,
            posZ: 0,
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0
        };

        this.updateUI = this.updateUI.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.handleCopyCameraParams = this.handleCopyCameraParams.bind(this);

        this.handleOK = this.handleOK.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    render() {
        const { posX, posY, posZ, rotateX, rotateY, rotateZ } = this.state;

        return <Window
            className={'VRSettingWindow'}
            title={_t('VR Setting')}
            style={{ width: '320px', height: '300px' }}
            mask={false}
            onClose={this.handleCancel}
        >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{`${_t('Camera Pos')}X`}</Label>
                        <Input name={'posX'}
                            type={'number'}
                            value={posX}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{`${_t('Camera Pos')}Y`}</Label>
                        <Input name={'posY'}
                            type={'number'}
                            value={posY}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{`${_t('Camera Pos')}Z`}</Label>
                        <Input name={'posZ'}
                            type={'number'}
                            value={posZ}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{`${_t('Camera Rotate')}X`}</Label>
                        <Input name={'rotateX'}
                            type={'number'}
                            value={rotateX}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{`${_t('Camera Rotate')}Y`}</Label>
                        <Input name={'rotateY'}
                            type={'number'}
                            value={rotateY}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{`${_t('Camera Rotate')}Z`}</Label>
                        <Input name={'rotateZ'}
                            type={'number'}
                            value={rotateZ}
                            onChange={this.handleChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Button onClick={this.handleCopyCameraParams}>{_t('Copy Camera Params')}</Button>
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleOK}>{_t('OK')}</Button>
                <Button onClick={this.handleCancel}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        this.updateUI();
    }

    updateUI() {
        const setting = global.app.options.vrSetting;

        this.setState({
            posX: setting.cameraPosX,
            posY: setting.cameraPosY,
            posZ: setting.cameraPosZ,
            rotateX: setting.cameraRotateX,
            rotateY: setting.cameraRotateY,
            rotateZ: setting.cameraRotateZ
        });
    }

    handleChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleCopyCameraParams() {
        const camera = app.editor.camera;
        this.setState({
            posX: camera.position.x,
            posY: camera.position.y,
            posZ: camera.position.z,
            rotateX: camera.rotation.x * 180 / Math.PI,
            rotateY: camera.rotation.y * 180 / Math.PI,
            rotateZ: camera.rotation.z * 180 / Math.PI
        });
    }

    handleOK() {
        const { posX, posY, posZ, rotateX, rotateY, rotateZ } = this.state;
        let setting = global.app.options.vrSetting;

        setting.cameraPosX = posX;
        setting.cameraPosY = posY;
        setting.cameraPosZ = posZ;
        setting.cameraRotateX = rotateX;
        setting.cameraRotateY = rotateY;
        setting.cameraRotateZ = rotateZ;

        this.handleCancel();
        global.app.toast(_t('Save Successfully.'), 'success');
    }

    handleCancel() {
        global.app.removeElement(this);
    }
}

export default VRSettingWindow;