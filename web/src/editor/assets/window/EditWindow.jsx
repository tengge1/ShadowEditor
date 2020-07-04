/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/EditWindow.css';
import { PropTypes } from '../../../third_party';
import { Window, Content, Buttons, Form, FormControl, Label, Input, Select, ImageUploader, Button, CheckBox } from '../../../ui/index';
import Ajax from '../../../utils/Ajax';
import CategoryWindow from './CategoryWindow.jsx';

/**
 * 编辑窗口
 * @author tengge / https://github.com/tengge1
 */
class EditWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.data.Name,
            categories: null,
            categoryID: props.data.CategoryID,
            thumbnail: props.data.Thumbnail,
            isPublic: props.data.IsPublic
        };

        this.updateUI = this.updateUI.bind(this);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleThumbnailChange = this.handleThumbnailChange.bind(this);
        this.handleIsPublicChange = this.handleIsPublicChange.bind(this);
        this.handleEditCategoryList = this.handleEditCategoryList.bind(this);

        this.handleSave = this.handleSave.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { type, typeName } = this.props;
        const { name, categories, categoryID, thumbnail, isPublic } = this.state;

        return <Window
            className={'EditWindow'}
            title={`${_t('Edit')} ${typeName}`}
            style={{ width: '320px', height: '300px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Name')}</Label>
                        <Input name={'name'}
                            value={name}
                            onChange={this.handleNameChange}
                        />
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Type')}</Label>
                        <Select name={'select'}
                            options={categories}
                            value={categoryID}
                            onChange={this.handleCategoryChange}
                        />
                        <Button onClick={this.handleEditCategoryList}>{_t('Edit')}</Button>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Thumbnail')}</Label>
                        <ImageUploader
                            server={app.options.server}
                            url={thumbnail}
                            noImageText={_t('No Image')}
                            onChange={this.handleThumbnailChange}
                        />
                    </FormControl>
                    {type === 'Scene' && <FormControl>
                        <Label>{_t('Is Public')}</Label>
                        <CheckBox name={'isPublic'}
                            checked={isPublic ? true : false}
                            onChange={this.handleIsPublicChange}
                        />
                    </FormControl>}
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleSave}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        this.updateUI();
    }

    updateUI() {
        Ajax.getJson(`${app.options.server}/api/Category/List?Type=${this.props.type}`, json => {
            var options = {
                '': _t('Not Set')
            };
            json.Data.forEach(n => {
                options[n.ID] = n.Name;
            });
            this.setState({
                categories: options
            });
        });
    }

    handleNameChange(value) {
        this.setState({
            name: value
        });
    }

    handleCategoryChange(value) {
        this.setState({
            categoryID: value
        });
    }

    handleThumbnailChange(file) {
        Ajax.post(`${app.options.server}/api/Upload/Upload`, {
            file
        }, json => {
            var obj = JSON.parse(json);
            if (obj.Code === 200) {
                this.setState({
                    thumbnail: obj.Data.url
                });
            } else {
                app.toast(_t(obj.Msg), 'warn');
            }
        });
    }

    handleIsPublicChange(value, name) {
        this.setState({
            [name]: value
        });
    }

    handleEditCategoryList() {
        const window = app.createElement(CategoryWindow, {
            type: this.props.type,
            typeName: `${this.props.typeName}`
        });

        app.addElement(window);
    }

    handleSave() {
        const { data, saveUrl, callback } = this.props;
        const { name, categoryID, thumbnail, isPublic } = this.state;

        Ajax.post(saveUrl, {
            ID: data.ID,
            Name: name,
            Category: categoryID,
            Image: thumbnail,
            IsPublic: isPublic
        }, json => {
            var obj = JSON.parse(json);
            if (obj.Code === 200) {
                callback && callback(obj);
                this.handleClose();
            } else {
                app.toast(_t(obj.Msg), 'warn');
            }
        });
    }

    handleClose() {
        app.removeElement(this);
    }
}

EditWindow.propTypes = {
    type: PropTypes.oneOf(['Scene', 'Mesh', 'Map', 'Texture', 'Material', 'Audio', 'Animation', 'Particle', 'Screenshot', 'Video']),
    typeName: PropTypes.string,
    data: PropTypes.object,
    saveUrl: PropTypes.string,
    callback: PropTypes.func
};

EditWindow.defaultProps = {
    type: 'Scene',
    typeName: 'Scene',
    data: null,
    saveUrl: null,
    callback: null
};

export default EditWindow;