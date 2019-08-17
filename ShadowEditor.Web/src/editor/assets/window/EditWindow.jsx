import './css/EditWindow.css';
import { classNames, PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Select, ImageUploader, Button } from '../../../third_party';
import Ajax from '../../../utils/Ajax';

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
        };

        this.updateUI = this.updateUI.bind(this);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleThumbnailChange = this.handleThumbnailChange.bind(this);

        this.handleSave = this.handleSave.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { typeName } = this.props;
        const { name, categories, categoryID, thumbnail } = this.state;

        return <Window
            className={'EditWindow'}
            title={`编辑${typeName}`}
            style={{ width: '320px', height: '300px', }}
            mask={true}
            onClose={this.handleClose}>
            <Content>
                <Form>
                    <FormControl>
                        <Label>{_t('Name')}</Label>
                        <Input name={'name'} value={name} onChange={this.handleNameChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Type')}</Label>
                        <Select name={'select'} options={categories} value={categoryID} onChange={this.handleCategoryChange}></Select>
                        <Button>{_t('Edit')}</Button>
                    </FormControl>
                    <FormControl>
                        <Label>{_t('Thumbnail')}</Label>
                        <ImageUploader
                            server={app.options.server}
                            url={thumbnail}
                            noImageText={_t('No Image')}
                            onChange={this.handleThumbnailChange}></ImageUploader>
                    </FormControl>
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
                categories: options,
            });
        });
    }

    handleNameChange(value) {
        this.setState({
            name: value,
        });
    }

    handleCategoryChange(value) {
        this.setState({
            categoryID: value,
        });
    }

    handleThumbnailChange(file) {
        Ajax.post(`${app.options.server}/api/Upload/Upload`, {
            file,
        }, json => {
            var obj = JSON.parse(json);
            if (obj.Code === 200) {
                this.setState({
                    thumbnail: obj.Data.url,
                });
            } else {
                app.toast(obj.Msg);
            }
        });
    }

    handleSave() {
        const { data, saveUrl, callback } = this.props;
        const { name, categoryID, thumbnail } = this.state;

        Ajax.post(saveUrl, {
            ID: data.ID,
            Name: name,
            Category: categoryID,
            Image: thumbnail
        }, json => {
            var obj = JSON.parse(json);
            if (obj.Code === 200) {
                callback && callback(obj);
                this.handleClose();
            } else {
                app.toast(obj.Msg);
            }
        });
    }

    handleClose() {
        app.removeElement(this);
    }

    // ----------------------------- 类别编辑 ----------------------------------------

    onEditCategory() {
        if (this.categoryListWin === undefined) {
            this.categoryListWin = new CategoryListWindow({
                app: app,
                type: this.type,
                title: `${_t('Edit')} ${this.typeName} ${_t('Category')}`,
            });
            this.categoryListWin.render();
        }

        this.categoryListWin.show();
    }
}

EditWindow.propTypes = {
    type: PropTypes.oneOf(['Scene', 'Mesh', 'Map', 'Texture', 'Material', 'Audio', 'Particle']),
    typeName: PropTypes.string,
    data: PropTypes.object,
    saveUrl: PropTypes.string,
    callback: PropTypes.func,
};

EditWindow.defaultProps = {
    type: 'Scene',
    typeName: 'Scene',
    data: null,
    saveUrl: null,
    callback: null,
};

export default EditWindow;