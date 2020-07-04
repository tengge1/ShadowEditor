/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/AddSkyBoxWindow.css';
import { PropTypes } from '../../../third_party';
import { Window, Content, Buttons, ImageSelector, Button } from '../../../ui/index';
import Ajax from '../../../utils/Ajax';

/**
 * 添加天空盒窗口
 * @author tengge / https://github.com/tengge1
 */
class AddSkyBoxWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posX: null,
            posXFile: null,
            negX: null,
            negXFile: null,
            posY: null,
            posYFile: null,
            negY: null,
            negYFile: null,
            posZ: null,
            posZFile: null,
            negZ: null,
            negZFile: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { posX, negX, posY, negY, posZ, negZ } = this.state;

        return <Window
            className={'AddSkyBoxWindow'}
            title={_t('Upload Sky Box')}
            style={{ width: '640px', height: '400px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <div className={'item'}>
                    <ImageSelector className={'selector'}
                        name={'posX'}
                        value={posX}
                        onChange={this.handleChange}
                    />
                    <div className={'title'}>PosX</div>
                </div>
                <div className={'item'}>
                    <ImageSelector className={'selector'}
                        name={'negX'}
                        value={negX}
                        onChange={this.handleChange}
                    />
                    <div className={'title'}>NegX</div>
                </div>
                <div className={'item'}>
                    <ImageSelector className={'selector'}
                        name={'posY'}
                        value={posY}
                        onChange={this.handleChange}
                    />
                    <div className={'title'}>PosY</div>
                </div>
                <div className={'item'}>
                    <ImageSelector className={'selector'}
                        name={'negY'}
                        value={negY}
                        onChange={this.handleChange}
                    />
                    <div className={'title'}>NegY</div>
                </div>
                <div className={'item'}>
                    <ImageSelector className={'selector'}
                        name={'posZ'}
                        value={posZ}
                        onChange={this.handleChange}
                    />
                    <div className={'title'}>PosZ</div>
                </div>
                <div className={'item'}>
                    <ImageSelector className={'selector'}
                        name={'negZ'}
                        value={negZ}
                        onChange={this.handleChange}
                    />
                    <div className={'title'}>NegZ</div>
                </div>
            </Content>
            <Buttons>
                <Button onClick={this.handleSave}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    handleChange(name, file) {
        let reader = new FileReader();

        reader.onload = e => {
            reader.onload = null;

            this.setState({
                [name]: e.target.result,
                [`${name}File`]: file
            });
        };

        reader.readAsDataURL(file);
    }

    handleSave(callback) {
        const { posXFile, negXFile, posYFile, negYFile, posZFile, negZFile } = this.state;

        if (!posXFile || !negXFile || !posYFile || !negYFile || !posZFile || !negZFile) {
            app.toast(_t('Please upload all the textures before save.'), 'warn');
            return;
        }

        Ajax.post(`${app.options.server}/api/Map/Add`, {
            posX: posXFile,
            negX: negXFile,
            posY: posYFile,
            negY: negYFile,
            posZ: posZFile,
            negZ: negZFile
        }, result => {
            let obj = JSON.parse(result);
            this.handleClose();
            callback && callback();
            app.toast(_t(obj.Msg));
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

AddSkyBoxWindow.propTypes = {
    callback: PropTypes.func
};

AddSkyBoxWindow.defaultProps = {
    callback: null
};

export default AddSkyBoxWindow;