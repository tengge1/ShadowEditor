import { classNames, PropTypes, Window, Content, Buttons, Form, FormControl, Label, Input, Select, Button } from '../../../third_party';
import Ajax from '../../../utils/Ajax';

/**
 * 编辑窗口
 * @author tengge / https://github.com/tengge1
 */
class EditWindow extends React.Component {
    constructor(props) {
        super(props);

        this.type = null;
        this.typeName = null;
        this.data = null;
        this.saveUrl = null;
        this.callback = null;

        this.state = {
            categories: null,
            categoryID: null,
        };

        this.updateUI = this.updateUI.bind(this);
        this.handleSave = this.handleSave.bind(this, props.callback);
        this.handleClose = this.handleClose.bind(this);
    }

    render() {
        const { type, typeName, data, saveUrl, callback } = this.props;
        const { categories, categoryID } = this.state;

        this.type = type;
        this.typeName = typeName;
        this.data = data;
        this.saveUrl = saveUrl;
        this.callback = callback;

        return <Window
            title={`编辑${typeName}`}
            style={{ width: '320px', height: '280px', }}
            mask={true}
            onClose={this.handleClose}>
            <Content>
                <Form>
                    <FormControl>
                        <Label>{L_NAME}</Label>
                        <Input name={'name'} value={data.title}></Input>
                    </FormControl>
                    <FormControl>
                        <Label>{L_TYPE}</Label>
                        <Select name={'select'} options={categories} value={categoryID}></Select>
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

    componentWillUnmount() {

    }

    updateUI() {
        // var name = UI.get('name', this.id);
        // var image = UI.get('image', this.id);
        // name.setValue(this.data.Name);
        // image.setValue(this.data.Thumbnail);

        // var category = UI.get('category', this.id);
        // category.clear();

        Ajax.getJson(`/api/Category/List?Type=${this.type}`, json => {
            var options = {
                '': L_NOT_SET
            };
            json.Data.forEach(n => {
                options[n.ID] = n.Name;
            });
            this.setState({
                categories: options,
                categoryID: this.data.CategoryID,
            });
        });
    }

    handleSave() {
        var name = UI.get('name', this.id);
        var category = UI.get('category', this.id);
        var image = UI.get('image', this.id);

        Ajax.post(this.saveUrl, {
            ID: this.data.ID,
            Name: name.getValue(),
            Category: category.getValue(),
            Image: image.getValue()
        }, json => {
            var obj = JSON.parse(json);
            UI.msg(obj.Msg);
            if (obj.Code === 200) {
                this.hide();
                this.callback && this.callback(obj);
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