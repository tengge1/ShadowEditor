import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty, SelectProperty, ColorProperty, TextureProperty, ButtonsProperty, Button } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';
import Converter from '../../utils/Converter';
import Ajax from '../../utils/Ajax';

/**
 * MMD模型组件
 * @author tengge / https://github.com/tengge1
 */
class MMDComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,

            reflect: false,
            showColor: false,
            color: '#ffffff',
            showSize: false,
            size: '1024',
            showClipBias: false,
            clipBias: 0,
            showRecursion: false,
            recursion: false,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, reflect, showColor, color, showSize, size, showClipBias, clipBias, showRecursion, recursion } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_MMD_MODEL} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <CheckBoxProperty label={L_REFLECT} name={'reflect'} value={reflect} onChange={this.handleChange}></CheckBoxProperty>
            <ColorProperty label={L_COLOR} name={'color'} value={color} show={showColor} onChange={this.handleChange}></ColorProperty>
            <SelectProperty label={L_TEXTURE_SIZE} name={'size'} options={this.sizes} value={size} show={showSize} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={L_CLIP_BIAS} name={'clipBias'} value={clipBias} show={showClipBias} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_RECURSION} name={'recursion'} value={recursion} show={showRecursion} onChange={this.handleChange}></CheckBoxProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.ReflectorComponent`, this.handleUpdate);
        app.on(`objectChanged.ReflectorComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Mesh)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        let state = {
            show: true,
        };

        if (this.selected instanceof THREE.Reflector) {
            Object.assign(state, {
                reflect: true,
                showColor: true,
                color: this.selected.userData.color,
                showSize: true,
                size: this.selected.userData.size,
                showClipBias: true,
                clipBias: this.selected.userData.clipBias,
                showRecursion: true,
                recursion: this.selected.userData.recursion,
            });
        } else {
            Object.assign(state, {
                reflect: false,
                showColor: false,
                showSize: false,
                showClipBias: false,
                showRecursion: false,
            });
        }

        this.setState(state);
    }

    // ----------------------------- 模型动画 ------------------------------------------

    handleSelectAnimation() {
        app.call(`selectBottomPanel`, this, 'animation');
        app.msg(L_CLICK_ANIMATION_PANEL);
        app.on(`selectAnimation.${this.id}`, this.onSelectAnimation);
    }

    onSelectAnimation(data) {
        if (data.Type !== 'mmd') {
            UI.msg(L_SELECT_MMD_ANIMATION_ONLY);
            return;
        }
        app.on(`selectAnimation.${this.id}`, null);

        this.selected.userData.Animation = {};
        Object.assign(this.selected.userData.Animation, data);
        this.updateUI();
    }

    // ---------------------------- 相机动画 -------------------------------------------

    handleSelectCameraAnimation() {
        app.call(`selectBottomPanel`, this, 'animation');
        UI.msg(L_CLICK_CAMERA_ANIMATION);
        app.on(`selectAnimation.${this.id}`, this.onSelectCameraAnimation);
    }

    onSelectCameraAnimation(data) {
        if (data.Type !== 'mmd') {
            UI.msg(L_SELECT_CAMERA_ANIMATION_ONLY);
            return;
        }
        app.on(`selectAnimation.${this.id}`, null);

        this.selected.userData.CameraAnimation = {};
        Object.assign(this.selected.userData.CameraAnimation, data);
        this.updateUI();
    }

    // ------------------------------ MMD音乐 --------------------------------------------

    handleSelectAudio() {
        app.call(`selectBottomPanel`, this, 'audio');
        UI.msg(L_SELECT_MMD_AUDIO);
        app.on(`selectAudio.${this.id}`, this.onSelectAudio.bind(this));
    }

    onSelectAudio(data) {
        app.on(`selectAudio.${this.id}`, null);

        this.selected.userData.Audio = {};
        Object.assign(this.selected.userData.Audio, data);
        this.updateUI();
    }
}

export default MMDComponent;