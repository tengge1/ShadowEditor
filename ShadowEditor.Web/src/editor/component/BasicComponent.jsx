import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';
import Text from '../../object/geometry/Text';

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

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Basic Info')} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <TextProperty label={_t('Name')} name={'name'} value={name} onChange={this.handleChangeName}></TextProperty>
            <DisplayProperty label={_t('Type')} name={'type'} value={type}></DisplayProperty>
            <CheckBoxProperty label={_t('Visible')} name={'visible'} value={visible} onChange={this.handleChangeVisible}></CheckBoxProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.BasicComponent`, this.handleUpdate);
        app.on(`objectChanged.BasicComponent`, this.handleUpdate);
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

    handleChangeName(value) {
        this.setState({
            name: value,
        });

        app.editor.execute(new SetValueCommand(this.selected, 'name', value));

        // bug: https://gitee.com/tengge1/ShadowEditor/issues/IV1V3
        if (this.selected instanceof Text) {
            this.selected.updateText(value);
        }

        app.call(`objectChanged`, this, this.selected);
    }

    handleChangeVisible(value) {
        this.setState({
            visible: value,
        });

        this.selected.visible = value;
        app.call(`objectChanged`, this, this.selected);
    }
}

export default BasicComponent;