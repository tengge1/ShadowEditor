import { classNames, PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Select, Button } from '../../../third_party';
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
        };

        this.updateUI = this.updateUI.bind(this);

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);

        this.handleSave = this.handleSave.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { typeName } = this.props;
        const { name, categories, categoryID } = this.state;

        return <Window
            title={`编辑${typeName}`}
            style={{ width: '320px', height: '280px', }}
            mask={true}
            onClose={this.handleClose}>
            <Content>
                <Form>
                    <FormControl>
                        <Label>{L_NAME}</Label>
                        <Input name={'name'} value={name} onChange={this.handleNameChange}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{L_TYPE}</Label>
                        <Select name={'select'} options={categories} value={categoryID} onChange={this.handleCategoryChange}></Select>
                    </FormControl>
                </Form>
            </Content>
            <Buttons>
                <Button onClick={this.handleSave}>{L_OK}</Button>
                <Button onClick={this.handleClose}>{L_CANCEL}</Button>
            </Buttons>
        </Window>;
    }

    componentDidMount() {
        this.updateUI();
    }

    updateUI() {
        Ajax.getJson(`/api/Category/List?Type=${this.props.type}`, json => {
            var options = {
                '': L_NOT_SET
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

    handleSave() {
        const { data, saveUrl, callback } = this.props;
        const { name, categoryID } = this.state;

        var image = UI.get('image', this.id);

        Ajax.post(saveUrl, {
            ID: data.ID,
            Name: name,
            Category: categoryID,
            Image: image.getValue()
        }, json => {
            var obj = JSON.parse(json);
            app.toast(obj.Msg);
            if (obj.Code === 200) {
                callback && callback(obj);
                this.handleClose();
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
                title: `${L_EDIT} ${this.typeName} ${L_CATEGORY}`,
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
    typeName: L_SCENE,
    data: null,
    saveUrl: null,
    callback: null,
};

export default EditWindow;