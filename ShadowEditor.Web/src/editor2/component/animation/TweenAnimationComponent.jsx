import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty } from '../../../third_party';
import SetGeometryCommand from '../../../command/SetGeometryCommand';

/**
 * 补间动画组件
 * @author tengge / https://github.com/tengge1
 */
class TweenAnimationComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.beginStatus = {
            Current: L_CURRENT_STATUS,
            Custom: L_CUSTOM_STATUS,
        };

        this.ease = {
            linear: 'Linear',
            quadIn: 'Quad In',
            quadOut: 'Quad Out',
            quadInOut: 'Quad In Out',
            cubicIn: 'Cubic In',
            cubicOut: 'Cubic Out',
            cubicInOut: 'Cubic InOut',
            quartIn: 'Quart In',
            quartOut: 'Quart Out',
            quartInOut: 'Quart InOut',
            quintIn: 'Quint In',
            quintOut: 'Quint Out',
            quintInOut: 'Quint In Out',
            sineIn: 'Sine In',
            sineOut: 'Sine Out',
            sineInOut: 'Sine In Out',
            backIn: 'Back In',
            backOut: 'Back Out',
            backInOut: 'Back In Out',
            circIn: 'Circ In',
            circOut: 'Circ Out',
            circInOut: 'Circ In Out',
            bounceIn: 'Bounce In',
            bounceOut: 'Bounce Out',
            bounceInOut: 'Bounce In Out',
            elasticIn: 'Elastic In',
            elasticOut: 'Elastic Out',
            elasticInOut: 'Elastic In Out',
        };

        this.state = {
            show: false,
            expanded: true,

            beginStatus: 'Custom',
            showBeginState: false,
            beginPositionX: 0,
            beginPositionY: 0,
            beginPositionZ: 0,
            beginRotationX: 0,
            beginRotationY: 0,
            beginRotationZ: 0,
            beginScaleLock: true,
            beginScaleX: 1,
            beginScaleY: 1,
            beginScaleZ: 1,

            ease: 'Linear',

            endStatus: 'Custom',
            showEndState: false,
            endPositionX: 0,
            endPositionY: 0,
            endPositionZ: 0,
            endRotationX: 0,
            endRotationY: 0,
            endRotationZ: 0,
            endScaleLock: true,
            endScaleX: 1,
            endScaleY: 1,
            endScaleZ: 1,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, beginStatus, showBeginState, beginPositionX, beginPositionY, beginPositionZ, beginRotationX, beginRotationY, beginRotationZ,
            beginScaleLock, beginScaleX, beginScaleY, beginScaleZ, ease, endStatus, showEndState, endPositionX, endPositionY, endPositionZ, endRotationX,
            endRotationY, endRotationZ, endScaleLock, endScaleX, endScaleY, endScaleZ } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_TWEEN_ANIMATION} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <SelectProperty label={L_BEGIN_STATUS} options={this.beginStatus} name={'beginStatus'} value={beginStatus} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={'beginPositionX'} name={'beginPositionX'} value={beginPositionX} show={showBeginState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginPositionY'} name={'beginPositionY'} value={beginPositionY} show={showBeginState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginPositionZ'} name={'beginPositionZ'} value={beginPositionZ} show={showBeginState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginRotationX'} name={'beginRotationX'} value={beginRotationX} show={showBeginState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginRotationY'} name={'beginRotationY'} value={beginRotationY} show={showBeginState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginRotationZ'} name={'beginRotationZ'} value={beginRotationZ} show={showBeginState} onChange={this.handleChange}></NumberProperty>
            <CheckProperty label={'beginScaleLock'} name={'beginScaleLock'} value={beginScaleLock} show={showBeginState} onChange={this.handleChange}></CheckProperty>
            <NumberProperty label={'beginScaleX'} name={'beginScaleX'} value={beginScaleX} show={showBeginState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginScaleY'} name={'beginScaleY'} value={beginScaleY} show={showBeginState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginScaleZ'} name={'beginScaleZ'} value={beginScaleZ} show={showBeginState} onChange={this.handleChange}></NumberProperty>

            <SelectProperty label={L_EASE_FUNC} options={this.ease} name={'ease'} value={ease} onChange={this.handleChange}></SelectProperty>

            <SelectProperty label={L_END_STATUS} options={this.beginStatus} name={'endStatus'} value={endStatus} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={'endPositionX'} name={'endPositionX'} value={endPositionX} show={showEndState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endPositionY'} name={'endPositionY'} value={endPositionY} show={showEndState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endPositionZ'} name={'endPositionZ'} value={endPositionZ} show={showEndState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endRotationX'} name={'endRotationX'} value={endRotationX} show={showEndState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endRotationY'} name={'endRotationY'} value={endRotationY} show={showEndState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endRotationZ'} name={'endRotationZ'} value={endRotationZ} show={showEndState} onChange={this.handleChange}></NumberProperty>
            <CheckProperty label={'endScaleLock'} name={'endScaleLock'} value={endScaleLock} show={showEndState} onChange={this.handleChange}></CheckProperty>
            <NumberProperty label={'endScaleX'} name={'endScaleX'} value={endScaleX} show={showEndState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endScaleY'} name={'endScaleY'} value={endScaleY} show={showEndState} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endScaleZ'} name={'endScaleZ'} value={endScaleZ} show={showEndState} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`animationSelected.TweenAnimationComponent`, this.handleUpdate.bind(this));
        app.on(`animationChanged.TweenAnimationComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate(animation) {
        if (!animation || animation.type !== 'Tween') {
            this.setState({
                show: false,
            });
            return;
        }

        this.animation = animation;

        let data = this.animation.data;

        let state = {
            show: true,
            beginStatus: data.beginStatus,
            showBeginState: data.beginStatus === 'Custom',
            beginPositionX: data.beginPositionX,
            beginPositionY: data.beginPositionY,
            beginPositionZ: data.beginPositionZ,
            beginRotationX: data.beginRotationX * 180 / Math.PI,
            beginRotationY: data.beginRotationY * 180 / Math.PI,
            beginRotationZ: data.beginRotationZ * 180 / Math.PI,
            beginScaleLock: data.beginScaleLock,
            beginScaleX: data.beginScaleX,
            beginScaleY: data.beginScaleY,
            beginScaleZ: data.beginScaleZ,
            ease: data.ease,
            endStatus: data.endStatus,
            showEndState: data.endStatus === 'Custom',
            endPositionX: data.endPositionX,
            endPositionY: data.endPositionY,
            endPositionZ: data.endPositionZ,
            endRotationX: data.endRotationX * 180 / Math.PI,
            endRotationY: data.endRotationY * 180 / Math.PI,
            endRotationZ: data.endRotationZ * 180 / Math.PI,
            endScaleLock: data.endScaleLock,
            endScaleX: data.endScaleX,
            endScaleY: data.endScaleY,
            endScaleZ: data.endScaleZ,
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

        const { beginStatus, showBeginState, beginPositionX, beginPositionY, beginPositionZ, beginRotationX, beginRotationY, beginRotationZ,
            beginScaleLock, beginScaleX, beginScaleY, beginScaleZ, ease, endStatus, showEndState, endPositionX, endPositionY, endPositionZ, endRotationX,
            endRotationY, endRotationZ, endScaleLock, endScaleX, endScaleY, endScaleZ } = Object.assign({}, this.state, {
                [name]: value,
            });

        this.animation.data = this.animation.data || {};

        this.animation.data.beginStatus = beginStatus;
        this.animation.data.beginPositionX = beginPositionX;
        this.animation.data.beginPositionY = beginPositionY;
        this.animation.data.beginPositionZ = beginPositionZ;
        this.animation.data.beginRotationX = beginRotationX * Math.PI / 180;
        this.animation.data.beginRotationY = beginRotationY * Math.PI / 180;
        this.animation.data.beginRotationZ = beginRotationZ * Math.PI / 180;
        this.animation.data.beginScaleLock = beginScaleLock;
        this.animation.data.beginScaleX = beginScaleX;
        this.animation.data.beginScaleY = beginScaleY;
        this.animation.data.beginScaleZ = beginScaleZ;
        this.animation.data.ease = ease;
        this.animation.data.endStatus = endStatus;
        this.animation.data.endPositionX = endPositionX;
        this.animation.data.endPositionY = endPositionY;
        this.animation.data.endPositionZ = endPositionZ;
        this.animation.data.endRotationX = endRotationX * Math.PI / 180;
        this.animation.data.endRotationY = endRotationY * Math.PI / 180;
        this.animation.data.endRotationZ = endRotationZ * Math.PI / 180;
        this.animation.data.endScaleLock = endScaleLock;
        this.animation.data.endScaleX = endScaleX;
        this.animation.data.endScaleY = endScaleY;
        this.animation.data.endScaleZ = endScaleZ;

        app.call('animationChanged', this, this.animation);
    }
}

export default TweenAnimationComponent;