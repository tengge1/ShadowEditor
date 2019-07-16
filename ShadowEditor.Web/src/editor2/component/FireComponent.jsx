import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, ButtonProperty, NumberProperty } from '../../third_party';
import SetValueCommand from '../../command/SetValueCommand';

/**
 * 火焰组件
 * @author tengge / https://github.com/tengge1
 */
class FireComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;
        this.isPlaying = false;

        this.state = {
            show: false,
            expanded: true,
            width: 2,
            height: 4,
            depth: 2,
            sliceSpacing: 2,
            previewText: L_PREVIEW,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.onAnimate = this.onAnimate.bind(this);
    }

    render() {
        const { show, expanded, width, height, depth, sliceSpacing, previewText } = this.state;

        return <PropertyGroup title={L_FIRE_COMPONENT} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty label={L_WIDTH} name={'width'} value={width} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_HEIGHT} name={'height'} value={height} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_DEPTH} name={'depth'} value={depth} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_SLICE_SPACING} name={'sliceSpacing'} value={sliceSpacing} onChange={this.handleChange}></NumberProperty>
            <ButtonProperty text={previewText} onChange={this.handlePreview}></ButtonProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.CameraComponent`, this.handleUpdate);
        app.on(`objectChanged.CameraComponent`, this.handleUpdate);
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || !(editor.selected.userData.type === 'Fire')) {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            width: this.selected.userData.width,
            height: this.selected.userData.height,
            depth: this.selected.userData.depth,
            sliceSpacing: this.selected.userData.sliceSpacing,
            previewText: this.isPlaying ? L_CANCEL : L_PREVIEW,
        });
    }

    handleChange(value, name) {
        let { width, height, depth, sliceSpacing } = this.state;

        switch (name) {
            case 'width':
                width = value;
                break;
            case 'height':
                height = value;
                break;
            case 'depth':
                depth = value;
                break;
            case 'sliceSpacing':
                sliceSpacing = value;
                break;
        }

        VolumetricFire.texturePath = 'assets/textures/VolumetricFire/';

        const editor = app.editor;

        let fire = new VolumetricFire(width, height, depth, sliceSpacing, editor.camera);

        fire.mesh.name = this.selected.name;
        fire.mesh.position.copy(this.selected.position);
        fire.mesh.rotation.copy(this.selected.rotation);
        fire.mesh.scale.copy(this.selected.scale);

        Object.assign(fire.mesh.userData, {
            type: 'Fire',
            fire,
            width,
            height,
            depth,
            sliceSpacing,
        });

        var index = editor.scene.children.indexOf(this.selected);
        if (index > -1) {
            editor.select(null);
            editor.scene.children[index] = fire.mesh;
            fire.mesh.parent = this.selected.parent;
            this.selected.parent = null;
            app.call(`objectRemoved`, this, this.selected);
            app.call(`objectAdded`, this, fire.mesh);
            editor.select(fire.mesh);
            app.call('sceneGraphChanged', this.id);

            fire.update(0);
        }
    }

    handlePreview() {
        if (this.isPlaying) {
            this.stopPreview();
        } else {
            this.startPreview();
        }
    }

    startPreview() {
        this.isPlaying = true;

        this.setState({
            previewText: L_CANCEL,
        });

        app.on(`animate.${this.id}`, this.onAnimate);
    }

    stopPreview() {
        this.isPlaying = false;

        this.setState({
            previewText: L_PREVIEW,
        });

        app.on(`animate.${this.id}`, null);
    }

    onAnimate(clock, deltaTime) {
        var elapsed = clock.getElapsedTime();

        var fire = this.selected.userData.fire;
        fire.update(elapsed);
    }
}

export default FireComponent;