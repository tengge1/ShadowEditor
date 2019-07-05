import { classNames, PropTypes, Window, Form, FormControl, Label, Input } from '../../../third_party';

/**
 * 编辑窗口
 * @author tengge / https://github.com/tengge1
 */
class EditWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { } = this.props;

        return <Window
            title={`编辑${this.typeName}`}
            style={{ width: '320px', height: '280px', }}
            mask={true}>
            <Form>
                <FormControl>
                    <Label>L_NAME</Label>
                    <Input name={'name'}></Input>
                </FormControl>
                <FormControl>
                    <Label>L_TYPE</Label>
                    <Input name={'select'}></Input>
                </FormControl>
            </Form>
        </Window>;
    }

    show() {
        UI.get('window', this.id).show();
    }

    hide() {
        UI.get('window', this.id).hide();
    }

    setData(data) {
        this.data = data;
        this.updateUI();
    }

    updateUI() {
        if (this.data === undefined) {
            return;
        }

        var name = UI.get('name', this.id);
        var image = UI.get('image', this.id);
        name.setValue(this.data.Name);
        image.setValue(this.data.Thumbnail);

        var category = UI.get('category', this.id);
        category.clear();

        Ajax.getJson(`/api/Category/List?Type=${this.type}`, json => {
            var options = {
                '': L_NOT_SET
            };
            json.Data.forEach(n => {
                options[n.ID] = n.Name;
            });
            category.options = options;
            category.value = this.data.CategoryID;
            category.render();
        });
    }

    save() {
        if (!this.data) {
            return;
        }

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