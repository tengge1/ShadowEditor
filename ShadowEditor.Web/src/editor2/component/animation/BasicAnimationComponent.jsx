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
        this.handleSetTarget = this.handleSetTarget.bind(this);
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
        if (!animation) {
            this.setState({
                show: false,
            });
            return;
        }

        this.animation = animation;

        let state = {
            show: true,
            name: this.animation.name,
            type: this.animation.type,
            beginTime: this.animation.beginTime,
            endTime: this.animation.endTime,
        };

        if (!this.animation.target) {
            state.target = '(' + L_NONE + ')';
        } else {
            let obj = app.editor.objectByUuid(this.animation.target);
            if (obj === null) {
                state.target = '(' + L_NONE + ')';
                console.warn(`BasicAnimationComponent: ${L_ANIMATION_OBJECT} ${this.animation.target} ${L_NOT_EXISTED_IN_SCENE}`);
            } else {
                state.target = obj.name;
            }
        }

        this.setState(state);
    }

    handleSetTarget() {
        let selected = app.editor.selected;

        if (selected == null) {
            this.animation.target = null;
        } else {
            this.animation.target = selected.uuid;
        }

        app.call('animationChanged', this, this.animation);
    }

    handleChange(value, animName) {
        if (value === null) {
            this.setState({
                [animName]: value,
            });
            return;
        }

        const { name, type, beginTime, endTime } = Object.assign({}, this.state, {
            [animName]: value,
        });

        this.animation.name = name;
        this.animation.type = type;
        this.animation.beginTime = beginTime;
        this.animation.endTime = endTime;

        app.call('animationChanged', this, this.animation);
    }
}

export default BasicAnimationComponent;