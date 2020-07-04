/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/EditModelWindow.css';
import { PropTypes } from '../../../third_party';
import { Window, TabLayout, Content, Buttons, Form, FormControl, Label, Input, Select, ImageUploader, Button, CheckBox, DataGrid, Column, LinkButton } from '../../../ui/index';
import Ajax from '../../../utils/Ajax';
import CategoryWindow from './CategoryWindow.jsx';

/**
 * 编辑模型窗口
 * @author tengge / https://github.com/tengge1
 */
class EditModelWindow extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTabIndex: 0,

            name: props.data.Name,
            categories: null,
            categoryID: props.data.CategoryID,
            thumbnail: props.data.Thumbnail,
            isPublic: props.data.IsPublic || false,

            histories: [],
            selectedHistory: null
        };

        this.handleActiveTabChange = this.handleActiveTabChange.bind(this);

        this.updateUI = this.updateUI.bind(this);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleThumbnailChange = this.handleThumbnailChange.bind(this);
        this.handleIsPublicChange = this.handleIsPublicChange.bind(this);
        this.handleEditCategoryList = this.handleEditCategoryList.bind(this);

        this.handleSelectHistory = this.handleSelectHistory.bind(this);
        this.loadHistoryRenderer = this.loadHistoryRenderer.bind(this);
        this.handleLoadHistory = this.handleLoadHistory.bind(this);

        this.handleDownload = this.handleDownload.bind(this);
        this.handleSave = this.handleSave.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { activeTabIndex, name, categories, categoryID, thumbnail, isPublic, histories, selectedHistory } = this.state;

        return <Window
            className={'EditModelWindow'}
            title={`${_t('Edit')} ${_t('Model')}`}
            style={{ width: '400px', height: '320px' }}
            mask={false}
            onClose={this.handleClose}
               >
            <Content>
                <TabLayout activeTabIndex={activeTabIndex}
                    onActiveTabChange={this.handleActiveTabChange}
                >
                    <Form title={_t('Basic Info')}>
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
                        <FormControl>
                            <Label>{_t('Is Public')}</Label>
                            <CheckBox name={'isPublic'}
                                checked={isPublic ? true : false}
                                disabled
                                onChange={this.handleIsPublicChange}
                            />
                        </FormControl>
                    </Form>
                    <DataGrid data={histories}
                        keyField={'ID'}
                        title={_t('Historic Version')}
                        selected={selectedHistory}
                        onSelect={this.handleSelectHistory}
                    >
                        <Column type={'number'} />
                        <Column field={'Version'}
                            title={_t('Version')}
                            width={80}
                            align={'center'}
                        />
                        <Column field={'UpdateTime'}
                            title={_t('Update Time')}
                            align={'center'}
                        />
                        <Column field={'ID'}
                            title={_t('')}
                            width={80}
                            align={'center'}
                            renderer={this.loadHistoryRenderer}
                        />
                    </DataGrid>
                </TabLayout>
            </Content>
            <Buttons>
                <Button className={'download'}
                    onClick={this.handleDownload}
                >{_t('Download')}</Button>
                <Button onClick={this.handleSave}>{_t('OK')}</Button>
                <Button onClick={this.handleClose}>{_t('Cancel')}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        this.updateUI();
    }

    handleActiveTabChange(activeTabIndex) {
        if (activeTabIndex === 1) { // 更新历史数据
            const { data } = this.props;
            fetch(`${app.options.server}/api/Mesh/HistoryList?ID=${data.ID}`).then(response => {
                response.json().then(json => {
                    this.setState({
                        histories: json.Data,
                        activeTabIndex
                    });
                });
            });
        } else {
            this.setState({
                activeTabIndex
            });
        }
    }

    updateUI() {
        Ajax.getJson(`${app.options.server}/api/Category/List?Type=Mesh`, json => {
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
            type: 'Mesh',
            typeName: `${_t('Model')}`
        });

        app.addElement(window);
    }

    handleSelectHistory(record) {
        this.setState({
            selectedHistory: record.ID
        });
    }

    loadHistoryRenderer(id, row) {
        if (row.IsNew) { // 当前版本
            return null;
        }
        return <LinkButton name={row.ID}
            onClick={this.handleLoadHistory}
               >{_t('Load')}</LinkButton>;
    }

    handleLoadHistory(name) {
        const history = this.state.histories.filter(n => n.ID === name)[0];

        if (!history) {
            app.toast(_t('The mesh is not existed!'));
            return;
        }

        let url = `${app.options.server}/api/Mesh/Load?ID=${history.MeshID}&Version=${history.Version}`;

        app.call(`load`, this, url, history.MeshName, history.ID);
    }

    handleDownload() {
        const { data } = this.props;

        fetch(`${app.options.server}/api/Mesh/Download?ID=${data.ID}`, {
            method: 'POST'
        }).then(response => {
            response.json().then(json => {
                if (json.Code !== 200) {
                    app.toast(_t(json.Msg), 'warn');
                    return;
                }
                window.open(`${app.options.server}${json.Path}`);
            });
        });
    }

    handleSave() {
        const { data, callback } = this.props;
        const { name, categoryID, thumbnail, isPublic } = this.state;

        Ajax.post(`${app.options.server}/api/Mesh/Edit`, {
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

EditModelWindow.propTypes = {
    data: PropTypes.object,
    callback: PropTypes.func
};

EditModelWindow.defaultProps = {
    data: null,
    callback: null
};

export default EditModelWindow;