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

            animation: null,
            cameraAnimation: null,
            audio: null,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleSelectAnimation = this.handleSelectAnimation.bind(this);
        this.onSelectAnimation = this.onSelectAnimation.bind(this);
        this.handleSelectCameraAnimation = this.handleSelectCameraAnimation.bind(this);
        this.onSelectCameraAnimation = this.onSelectCameraAnimation.bind(this);
        this.handleSelectAudio = this.handleSelectAudio.bind(this);
        this.onSelectAudio = this.onSelectAudio.bind(this);
    }

    render() {
        const { show, expanded, animation, cameraAnimation, audio } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_MMD_MODEL} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <DisplayProperty label={L_MODEL_ANIMATION} name={'animation'} value={animation} btnShow={true} btnText={L_SELECT} onClick={this.handleSelectAnimation}></DisplayProperty>
            <DisplayProperty label={L_CAMERA_ANIMATION} name={'cameraAnimation'} value={cameraAnimation} btnShow={true} btnText={L_SELECT} onClick={this.handleSelectCameraAnimation}></DisplayProperty>
            <DisplayProperty label={L_AUDIO} name={'audio'} value={audio} btnShow={true} btnText={L_SELECT} onClick={this.handleSelectAudio}></DisplayProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.MMDComponent`, this.handleUpdate);
        app.on(`objectChanged.MMDComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.userData.Type === 'pmd' || editor.selected.userData.Type === 'pmx')) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        let state = {
            show: true,
            animation: this.selected.userData.Animation ? this.selected.userData.Animation.Name : null,
            cameraAnimation: this.selected.userData.CameraAnimation ? this.selected.userData.CameraAnimation.Name : null,
            audio: this.selected.userData.Audio ? this.selected.userData.Audio.Name : null,
        };

        this.setState(state);
    }

    // ----------------------------- 模型动画 ------------------------------------------

    handleSelectAnimation() {
        app.call(`selectBottomPanel`, this, 'animation');
        app.toast(L_CLICK_ANIMATION_PANEL);
        app.on(`selectAnimation.MMDComponent`, this.onSelectAnimation);
    }

    onSelectAnimation(data) {
        if (data.Type !== 'mmd') {
            app.toast(L_SELECT_MMD_ANIMATION_ONLY);
            return;
        }
        app.on(`selectAnimation.MMDComponent`, null);

        this.selected.userData.Animation = {};
        Object.assign(this.selected.userData.Animation, data);

        app.call(`objectChanged`, this, this.selected);
    }

    // ---------------------------- 相机动画 -------------------------------------------

    handleSelectCameraAnimation() {
        app.call(`selectBottomPanel`, this, 'animation');
        app.toast(L_CLICK_CAMERA_ANIMATION);
        app.on(`selectAnimation.MMDComponent`, this.onSelectCameraAnimation);
    }

    onSelectCameraAnimation(data) {
        if (data.Type !== 'mmd') {
            app.toast(L_SELECT_CAMERA_ANIMATION_ONLY);
            return;
        }
        app.on(`selectAnimation.MMDComponent`, null);

        this.selected.userData.CameraAnimation = {};
        Object.assign(this.selected.userData.CameraAnimation, data);

        app.call(`objectChanged`, this, this.selected);
    }

    // ------------------------------ MMD音乐 --------------------------------------------

    handleSelectAudio() {
        app.call(`selectBottomPanel`, this, 'audio');
        app.toast(L_SELECT_MMD_AUDIO);
        app.on(`selectAudio.MMDComponent`, this.onSelectAudio.bind(this));
    }

    onSelectAudio(data) {
        app.on(`selectAudio.MMDComponent`, null);

        this.selected.userData.Audio = {};
        Object.assign(this.selected.userData.Audio, data);

        app.call(`objectChanged`, this, this.selected);
    }
}

export default MMDComponent;