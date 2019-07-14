import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty } from '../../third_party';

/**
 * 基本信息组件
 * @author tengge / https://github.com/tengge1
 */
class BasicComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            expanded: true,
            name: '',
            type: '',
            visible: true,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeVisible = this.handleChangeVisible.bind(this);
    }

    render() {
        const { show, expanded, name, type, visible } = this.state;

        return <PropertyGroup title={L_BASIC_INFO} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <TextProperty name={'name'} label={L_NAME} value={name} onChange={this.handleChangeName}></TextProperty>
            <DisplayProperty name={'type'} label={L_TYPE} value={type}></DisplayProperty>
            <CheckBoxProperty name={'visible'} label={L_VISIBLE} value={visible} onChange={this.handleChangeVisible}></CheckBoxProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.${this.id}`, this.handleUpdate);
        app.on(`objectChanged.${this.id}`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            name: this.selected.name,
            type: this.selected.constructor.name,
            visible: this.selected.visible,
        });
    }

    handleChangeName() {
        var name = UI.get('name', this.id);
        var editor = app.editor;

        editor.execute(new SetValueCommand(this.selected, 'name', name.getValue()));

        // bug: https://gitee.com/tengge1/ShadowEditor/issues/IV1V3
        if (this.selected instanceof Text) {
            this.selected.updateText(name.getValue());
        }
    }

    handleChangeVisible(name, value, event) {
        this.selected.visible = value;
    }
}

export default BasicComponent;