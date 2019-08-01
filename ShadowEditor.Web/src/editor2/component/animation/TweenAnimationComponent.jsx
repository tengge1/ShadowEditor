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
        const { show, expanded, beginStatus, beginPositionX, beginPositionY, beginPositionZ, beginRotationX, beginRotationY, beginRotationZ,
            beginScaleLock, beginScaleX, beginScaleY, beginScaleZ, ease, endStatus, endPositionX, endPositionY, endPositionZ, endRotationX,
            endRotationY, endRotationZ, endScaleLock, endScaleX, endScaleY, endScaleZ } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_TWEEN_ANIMATION} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <SelectProperty label={L_BEGIN_STATUS} options={this.beginStatus} name={'beginStatus'} value={beginStatus} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={'beginPositionX'} name={'beginPositionX'} value={beginPositionX} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginPositionY'} name={'beginPositionY'} value={beginPositionY} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginPositionZ'} name={'beginPositionZ'} value={beginPositionZ} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginRotationX'} name={'beginRotationX'} value={beginRotationX} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginRotationY'} name={'beginRotationY'} value={beginRotationY} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginRotationZ'} name={'beginRotationZ'} value={beginRotationZ} onChange={this.handleChange}></NumberProperty>
            <CheckProperty label={'beginScaleLock'} name={'beginScaleLock'} value={beginScaleLock} onChange={this.handleChange}></CheckProperty>
            <NumberProperty label={'beginScaleX'} name={'beginScaleX'} value={beginScaleX} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginScaleY'} name={'beginScaleY'} value={beginScaleY} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'beginScaleZ'} name={'beginScaleZ'} value={beginScaleZ} onChange={this.handleChange}></NumberProperty>

            <SelectProperty label={L_EASE_FUNC} options={this.ease} name={'ease'} value={ease} onChange={this.handleChange}></SelectProperty>

            <SelectProperty label={L_END_STATUS} options={this.beginStatus} name={'endStatus'} value={endStatus} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={'endPositionX'} name={'endPositionX'} value={endPositionX} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endPositionY'} name={'endPositionY'} value={endPositionY} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endPositionZ'} name={'endPositionZ'} value={endPositionZ} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endRotationX'} name={'endRotationX'} value={endRotationX} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endRotationY'} name={'endRotationY'} value={endRotationY} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endRotationZ'} name={'endRotationZ'} value={endRotationZ} onChange={this.handleChange}></NumberProperty>
            <CheckProperty label={'endScaleLock'} name={'endScaleLock'} value={endScaleLock} onChange={this.handleChange}></CheckProperty>
            <NumberProperty label={'endScaleX'} name={'endScaleX'} value={endScaleX} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endScaleY'} name={'endScaleY'} value={endScaleY} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'endScaleZ'} name={'endScaleZ'} value={endScaleZ} onChange={this.handleChange}></NumberProperty>
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

        let state = {
            show: true,
            name: this.animation.name,
            type: this.animation.type,
            beginTime: this.animation.beginTime,
            endTime: this.animation.endTime,
        };

        var data = this.animation.data;

        switch (data.beginStatus) {
            case 'Current':
                beginPositionRow.dom.style.display = 'none';
                beginRotationRow.dom.style.display = 'none';
                beginScaleRow.dom.style.display = 'none';
                break;
            case 'Custom':
                beginPositionRow.dom.style.display = '';
                beginRotationRow.dom.style.display = '';
                beginScaleRow.dom.style.display = '';
                break;
        }

        switch (data.endStatus) {
            case 'Current':
                endPositionRow.dom.style.display = 'none';
                endRotationRow.dom.style.display = 'none';
                endScaleRow.dom.style.display = 'none';
                break;
            case 'Custom':
                endPositionRow.dom.style.display = '';
                endRotationRow.dom.style.display = '';
                endScaleRow.dom.style.display = '';
                break;
        }

        beginStatus.setValue(data.beginStatus);
        beginPositionX.setValue(data.beginPositionX);
        beginPositionY.setValue(data.beginPositionY);
        beginPositionZ.setValue(data.beginPositionZ);
        beginRotationX.setValue(data.beginRotationX * 180 / Math.PI);
        beginRotationY.setValue(data.beginRotationY * 180 / Math.PI);
        beginRotationZ.setValue(data.beginRotationZ * 180 / Math.PI);
        beginScaleLock.setValue(data.beginScaleLock);
        beginScaleX.setValue(data.beginScaleX);
        beginScaleY.setValue(data.beginScaleY);
        beginScaleZ.setValue(data.beginScaleZ);
        ease.setValue(data.ease);
        endStatus.setValue(data.endStatus);
        endPositionX.setValue(data.endPositionX);
        endPositionY.setValue(data.endPositionY);
        endPositionZ.setValue(data.endPositionZ);
        endRotationX.setValue(data.endRotationX * 180 / Math.PI);
        endRotationY.setValue(data.endRotationY * 180 / Math.PI);
        endRotationZ.setValue(data.endRotationZ * 180 / Math.PI);
        endScaleLock.setValue(data.endScaleLock);
        endScaleX.setValue(data.endScaleX);
        endScaleY.setValue(data.endScaleY);
        endScaleZ.setValue(data.endScaleZ);

        this.setState(state);
    }

    handleChange(value, name) {
        this.setState({
            [name]: value,
        });

        if (value === null) {
            return;
        }

        var beginPositionRow = UI.get('beginPositionRow', this.id);
        var beginRotationRow = UI.get('beginRotationRow', this.id);
        var beginScaleRow = UI.get('beginScaleRow', this.id);
        var endPositionRow = UI.get('endPositionRow', this.id);
        var endRotationRow = UI.get('endRotationRow', this.id);
        var endScaleRow = UI.get('endScaleRow', this.id);

        var beginStatus = UI.get('beginStatus', this.id);
        var beginPositionX = UI.get('beginPositionX', this.id);
        var beginPositionY = UI.get('beginPositionY', this.id);
        var beginPositionZ = UI.get('beginPositionZ', this.id);
        var beginRotationX = UI.get('beginRotationX', this.id);
        var beginRotationY = UI.get('beginRotationY', this.id);
        var beginRotationZ = UI.get('beginRotationZ', this.id);
        var beginScaleLock = UI.get('beginScaleLock', this.id);
        var beginScaleX = UI.get('beginScaleX', this.id);
        var beginScaleY = UI.get('beginScaleY', this.id);
        var beginScaleZ = UI.get('beginScaleZ', this.id);
        var ease = UI.get('ease', this.id);
        var endStatus = UI.get('endStatus', this.id);
        var endPositionX = UI.get('endPositionX', this.id);
        var endPositionY = UI.get('endPositionY', this.id);
        var endPositionZ = UI.get('endPositionZ', this.id);
        var endRotationX = UI.get('endRotationX', this.id);
        var endRotationY = UI.get('endRotationY', this.id);
        var endRotationZ = UI.get('endRotationZ', this.id);
        var endScaleLock = UI.get('endScaleLock', this.id);
        var endScaleX = UI.get('endScaleX', this.id);
        var endScaleY = UI.get('endScaleY', this.id);
        var endScaleZ = UI.get('endScaleZ', this.id);

        switch (beginStatus.getValue()) {
            case 'Current':
                beginPositionRow.dom.style.display = 'none';
                beginRotationRow.dom.style.display = 'none';
                beginScaleRow.dom.style.display = 'none';
                break;
            case 'Custom':
                beginPositionRow.dom.style.display = '';
                beginRotationRow.dom.style.display = '';
                beginScaleRow.dom.style.display = '';
                break;
        }

        switch (endStatus.getValue()) {
            case 'Current':
                endPositionRow.dom.style.display = 'none';
                endRotationRow.dom.style.display = 'none';
                endScaleRow.dom.style.display = 'none';
                break;
            case 'Custom':
                endPositionRow.dom.style.display = '';
                endRotationRow.dom.style.display = '';
                endScaleRow.dom.style.display = '';
                break;
        }

        this.animation.data = this.animation.data || {};

        this.animation.data.beginStatus = beginStatus.getValue();
        this.animation.data.beginPositionX = beginPositionX.getValue();
        this.animation.data.beginPositionY = beginPositionY.getValue();
        this.animation.data.beginPositionZ = beginPositionZ.getValue();
        this.animation.data.beginRotationX = beginRotationX.getValue() * Math.PI / 180;
        this.animation.data.beginRotationY = beginRotationY.getValue() * Math.PI / 180;
        this.animation.data.beginRotationZ = beginRotationZ.getValue() * Math.PI / 180;
        this.animation.data.beginScaleLock = beginScaleLock.getValue();
        this.animation.data.beginScaleX = beginScaleX.getValue();
        this.animation.data.beginScaleY = beginScaleY.getValue();
        this.animation.data.beginScaleZ = beginScaleZ.getValue();
        this.animation.data.ease = ease.getValue();
        this.animation.data.endStatus = endStatus.getValue();
        this.animation.data.endPositionX = endPositionX.getValue();
        this.animation.data.endPositionY = endPositionY.getValue();
        this.animation.data.endPositionZ = endPositionZ.getValue();
        this.animation.data.endRotationX = endRotationX.getValue() * Math.PI / 180;
        this.animation.data.endRotationY = endRotationY.getValue() * Math.PI / 180;
        this.animation.data.endRotationZ = endRotationZ.getValue() * Math.PI / 180;
        this.animation.data.endScaleLock = endScaleLock.getValue();
        this.animation.data.endScaleX = endScaleX.getValue();
        this.animation.data.endScaleY = endScaleY.getValue();
        this.animation.data.endScaleZ = endScaleZ.getValue();

        app.call('animationChanged', this, this.animation);
    }
}

export default TweenAnimationComponent;