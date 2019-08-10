import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 半色调特效组件
 * @author tengge / https://github.com/tengge1
 */
class HalftoneComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.shape = {
            1: L_POINT,
            2: L_ELLIPSE,
            3: L_LINE,
            4: L_SQUARE,
        };

        this.blendingMode = {
            1: L_LINEAR,
            2: L_MULTIPLY,
            3: L_ADD,
            4: L_LIGHTER,
            5: L_DARKER,
        };

        this.state = {
            show: false,
            expanded: false,
            enabled: false,
            shape: 1,
            radius: 4,
            rotateR: 15,
            rotateG: 45,
            rotateB: 30,
            scatter: 0,
            blending: 1,
            blendingMode: 1,
            greyscale: false,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, enabled, shape, radius, rotateR, rotateG, rotateB, scatter, blending, blendingMode, greyscale } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_HALFTONE_EFFECT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <CheckBoxProperty label={L_ENABLE_STATE} name={'enabled'} value={enabled} onChange={this.handleChange}></CheckBoxProperty>
            <SelectProperty label={L_SHAPE} options={this.shape} name={'shape'} value={shape} onChange={this.handleChange}></SelectProperty>
            <IntegerProperty label={L_RADIUS} name={'radius'} value={radius} onChange={this.handleChange}></IntegerProperty>
            <NumberProperty label={L_ROTATE_RED} name={'rotateR'} value={rotateR} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_ROTATE_GREEN} name={'rotateG'} value={rotateG} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_ROTATE_BLUE} name={'rotateB'} value={rotateB} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_SCATTER} name={'scatter'} value={scatter} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_BLENDING} name={'blending'} value={blending} onChange={this.handleChange}></NumberProperty>
            <SelectProperty label={L_BLENDING_MODE} options={this.blendingMode} name={'blendingMode'} value={blendingMode} onChange={this.handleChange}></SelectProperty>
            <CheckBoxProperty label={L_GREY_SCALE} name={'greyscale'} value={greyscale} onChange={this.handleChange}></CheckBoxProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.HalftoneComponent`, this.handleUpdate);
        app.on(`objectChanged.HalftoneComponent`, this.handleUpdate);
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
            enabled: postProcessing.halftone ? postProcessing.halftone.enabled : false,
            shape: postProcessing.halftone ? postProcessing.halftone.shape : this.state.shape,
            radius: postProcessing.halftone ? postProcessing.halftone.radius : this.state.radius,
            rotateR: postProcessing.halftone ? postProcessing.halftone.rotateR : this.state.rotateR,
            rotateB: postProcessing.halftone ? postProcessing.halftone.rotateB : this.state.rotateG,
            rotateG: postProcessing.halftone ? postProcessing.halftone.rotateG : this.state.rotateB,
            scatter: postProcessing.halftone ? postProcessing.halftone.scatter : this.state.scatter,
            blending: postProcessing.halftone ? postProcessing.halftone.blending : this.state.blending,
            blendingMode: postProcessing.halftone ? postProcessing.halftone.blendingMode : this.state.blendingMode,
            greyscale: postProcessing.halftone ? postProcessing.halftone.greyscale : this.state.greyscale,
        };

        this.setState(state);
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { enabled, shape, radius, rotateR, rotateG, rotateB, scatter, blending, blendingMode, greyscale } = Object.assign({}, this.state, {
            [name]: value,
        });

        let scene = this.selected;

        scene.userData.postProcessing = scene.userData.postProcessing || {};

        Object.assign(scene.userData.postProcessing, {
            halftone: {
                enabled,
                shape,
                radius,
                rotateR,
                rotateG,
                rotateB,
                scatter,
                blending,
                blendingMode,
                greyscale,
            },
        });

        app.call(`objectChanged`, this, this.selected);
        app.call(`postProcessingChanged`, this);
    }
}

export default HalftoneComponent;