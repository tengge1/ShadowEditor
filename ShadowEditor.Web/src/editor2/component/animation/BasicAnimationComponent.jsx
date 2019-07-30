import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 动画基本信息组件
 * @author tengge / https://github.com/tengge1
 */
class BasicAnimationComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.animationType = {
            Tween: L_TWEEN_ANIMATION,
            Skeletal: L_SKELETAL_ANIMATION,
            Audio: L_PLAY_AUDIO,
            Filter: L_FILTER_ANIMATION,
            Particle: L_PARTICLE_ANIMATION,
        };

        this.state = {
            show: false,
            expanded: true,
            name: '',
            target: '',
            type: null,
            beginTime: 0,
            endTime: 10,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, name, target, type, beginTime, endTime } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_BASIC_INFORMATION} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <TextProperty label={L_NAME} name={'name'} value={name} onChange={this.handleChange}></TextProperty>
            <TextProperty label={L_TARGET} name={'target'} value={target} onChange={this.handleChange}></TextProperty>
            <SelectProperty label={L_TYPE} options={this.animationType} name={'type'} value={type} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={L_BEGIN_TIME} name={'beginTime'} value={beginTime} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_END_TIME} name={'endTime'} value={endTime} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`animationSelected.BasicAnimationComponent`, this.handleUpdate.bind(this));
        app.on(`animationChanged.BasicAnimationComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate(animation) {
        var container = UI.get('basicAnimationPanel', this.id);
        if (animation) {
            container.dom.style.display = '';
        } else {
            container.dom.style.display = 'none';
            return;
        }

        this.animation = animation;

        var name = UI.get('name', this.id);
        var target = UI.get('target', this.id);
        var type = UI.get('type', this.id);
        var beginTime = UI.get('beginTime', this.id);
        var endTime = UI.get('endTime', this.id);

        name.setValue(this.animation.name);

        if (!this.animation.target) {
            target.setValue('(' + L_NONE + ')');
        } else {
            var obj = app.editor.objectByUuid(this.animation.target);
            if (obj === null) {
                target.setValue('(' + L_NONE + ')');
                console.warn(`BasicAnimationComponent: ${L_ANIMATION_OBJECT} ${this.animation.target} ${L_NOT_EXISTED_IN_SCENE}`);
            } else {
                target.setValue(obj.name);
            }
        }

        type.setValue(this.animation.type);
        beginTime.setValue(this.animation.beginTime);
        endTime.setValue(this.animation.endTime);
    }

    handleSetTarget() {
        var selected = app.editor.selected;
        if (selected == null) {
            this.animation.target = null;
        } else {
            this.animation.target = selected.uuid;
        }

        app.call('animationChanged', this, this.animation);
    }

    handleChange() {
        var name = UI.get('name', this.id);
        var type = UI.get('type', this.id);
        var beginTime = UI.get('beginTime', this.id);
        var endTime = UI.get('endTime', this.id);

        this.animation.name = name.getValue();
        this.animation.type = type.getValue();
        this.animation.beginTime = beginTime.getValue();
        this.animation.endTime = endTime.getValue();

        app.call('animationChanged', this, this.animation);
    }
}

export default BasicAnimationComponent;