import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 残影特效组件
 * @author tengge / https://github.com/tengge1
 */
class AfterimageComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            enabled: false,
            damp: 0.92,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, enabled, damp } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_AFTERIMAGE_EFFECT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <CheckBoxProperty label={L_ENABLE_STATE} name={'enabled'} value={enabled} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_DAMP} name={'damp'} value={damp} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.AfterimageComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.AfterimageComponent`, this.handleUpdate.bind(this));
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
            enabled: postProcessing.afterimage ? postProcessing.afterimage.enabled : false,
            damp: postProcessing.afterimage ? postProcessing.afterimage.damp : this.state.damp,
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

        const { enabled, damp } = Object.assign({}, this.state, {
            [name]: value,
        });

        let scene = this.selected;

        scene.userData.postProcessing = scene.userData.postProcessing || {};

        Object.assign(scene.userData.postProcessing, {
            afterimage: {
                enabled,
                damp,
            },
        });

        app.call(`postProcessingChanged`, this);
    }
}

export default AfterimageComponent;