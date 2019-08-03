import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, ButtonProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 音频监听器组件
 * @author tengge / https://github.com/tengge1
 */
class BackgroundMusicComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            name: '',
            autoplay: false,
            loop: true,
            volume: 1,
            showPlayButton: false,
            isPlaying: false,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.onSelectAudio = this.onSelectAudio.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
    }

    render() {
        const { show, expanded, name, autoplay, loop, volume, showPlayButton, isPlaying } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_BACKGROUND_MUSIC} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <DisplayProperty label={L_AUDIO} name={'name'} value={name === '' ? `(${L_NONE})` : name} btnShow={true} btnText={L_SELECT} onClick={this.handleSelect}></DisplayProperty>
            <CheckBoxProperty label={L_AUTO_PLAY} name={'autoplay'} value={autoplay} onChange={this.handleChange}></CheckBoxProperty>
            <CheckBoxProperty label={L_LOOP} name={'loop'} value={loop} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_VOLUME} name={'volume'} value={volume} onChange={this.handleChange}></NumberProperty>
            <ButtonProperty text={isPlaying ? L_STOP : L_PLAY} show={showPlayButton} onChange={this.handlePlay}></ButtonProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.BackgroundMusicComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.BackgroundMusicComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected instanceof THREE.Audio)) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        let state = {
            show: true,
            name: this.selected.userData.Name || '',
            autoplay: this.selected.userData.autoplay || false,
            loop: this.selected.getLoop(),
            volumn: this.selected.getVolume(),
            showPlayButton: this.selected.buffer != null,
            isPlaying: this.selected.isPlaying || false,
        };

        this.setState(state);
    }

    handleSelect() {
        app.call(`selectBottomPanel`, this, 'audio');
        app.toast(L_CLICK_AUDIO_IN_PANEL);
        app.on(`selectAudio.${this.id}`, this.onSelectAudio);
    }

    onSelectAudio(obj) {
        app.on(`selectAudio.${this.id}`, null);

        Object.assign(this.selected.userData, obj);

        let loader = new THREE.AudioLoader();

        loader.load(obj.Url, buffer => {
            this.selected.setBuffer(buffer);

            this.setState({
                name: obj.Name,
                showPlayButton: true,
            });
        });
    }

    handleChange(value, name) {
        this.setState({
            [name]: value,
        });

        if (value === null) {
            return;
        }

        const { autoplay, loop, volumn } = Object.assign({}, this.state, {
            [name]: value,
        });

        this.selected.userData.autoplay = autoplay; // 这里不能给this.selected赋值，否则音频会自动播放
        this.selected.setLoop(loop);
        this.selected.setVolume(volumn);

        app.call('objectChanged', this, this.selected);
    }

    handlePlay() {
        if (!this.selected.buffer) {
            this.setState({
                showPlayButton: false,
                isPlaying: false,
            });
            return;
        }

        if (this.selected.isPlaying) {
            this.selected.stop();

        } else {
            this.selected.play();
        }

        this.setState({
            showPlayButton: true,
            isPlaying: this.selected.isPlaying,
        });
    }
}

export default BackgroundMusicComponent;