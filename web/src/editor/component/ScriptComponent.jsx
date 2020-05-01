import { PropertyGroup } from '../../ui/index';

/**
 * 脚本组件
 * @author tengge / https://github.com/tengge1
 */
class ScriptComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    render() {
        const { show, expanded } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('ScriptComponent')}
            show={show}
            expanded={expanded}
            onExpand={this.handleExpand}
               />;
    }

    componentDidMount() {
        app.on(`objectSelected.ScriptComponent`, this.handleUpdate);
        app.on(`objectChanged.ScriptComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !editor.selected.userData) {
            this.setState({
                show: false
            });
            return;
        }

        this.selected = editor.selected;

        let state = {
            show: true
        };

        this.setState(state);
    }
}

export default ScriptComponent;