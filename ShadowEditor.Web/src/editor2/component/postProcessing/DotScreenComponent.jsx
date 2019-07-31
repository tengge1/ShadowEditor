import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 点阵化组件
 * @author tengge / https://github.com/tengge1
 */
class DotScreenComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            enabled: false,
            scale: 4.0,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, enabled, scale } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_DOT_SCREEN_EFFECT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <CheckBoxProperty label={L_ENABLE_STATE} name={'enabled'} value={enabled} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_SCALE} name={'scale'} value={scale} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.DotScreenComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.DotScreenComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.scene) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        let scene = this.selected;
        let postProcessing = scene.userData.postProcessing || {};

        let state = {
            show: true,
            enabled: postProcessing.dotScreen ? postProcessing.dotScreen.enabled : false,
            scale: postProcessing.dotScreen ? postProcessing.dotScreen.scale : this.state.scale,
        };

        this.setState(state);
    }

    handleChange(value, name) {
        this.setState({
            [name]: value,
        });

        if (value === null) {
            return;
        }

        const { enabled, scale } = Object.assign({}, this.state, {
            [name]: value,
        });

        let scene = this.selected;

        scene.userData.postProcessing = scene.userData.postProcessing || {};

        Object.assign(scene.userData.postProcessing, {
            dotScreen: {
                enabled,
                scale,
            },
        });

        app.call(`postProcessingChanged`, this);
    }
}

export default DotScreenComponent;