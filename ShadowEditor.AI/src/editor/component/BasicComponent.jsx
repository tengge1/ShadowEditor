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

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('Basic Info')} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <TextProperty label={_t('Name')} name={'name'} value={name} onChange={this.handleChangeName}></TextProperty>
            <DisplayProperty label={_t('Type')} name={'type'} value={type}></DisplayProperty>
        </PropertyGroup>;
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

    }
}

export default BasicComponent;