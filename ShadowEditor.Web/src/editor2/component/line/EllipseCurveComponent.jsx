import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty, ButtonsProperty, Button } from '../../../third_party';

/**
 * 椭圆曲线组件
 * @author tengge / https://github.com/tengge1
 */
class EllipseCurveComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: true,
            aX: 0,
            aY: 0,
            xRadius: 0,
            yRadius: 0,
            aStartAngle: 0,
            aEndAngle: 0,
            aClockwise: false,
            aRotation: 0,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_ELLIPSE_CURVE} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty label={'Center X'} name={'aX'} value={aX} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'Center Y'} name={'aY'} value={aY} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'Radius X'} name={'xRadius'} value={xRadius} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'Radius Y'} name={'yRadius'} value={yRadius} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'Start Angle'} name={'aStartAngle'} value={aStartAngle} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={'End Angle'} name={'aEndAngle'} value={aEndAngle} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={'Clockwise'} name={'aClockwise'} value={aClockwise} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={'Rotation'} name={'aRotation'} value={aRotation} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.EllipseCurveComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.EllipseCurveComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected.userData.type !== 'EllipseCurve') {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            aX: this.selected.userData.aX,
            aY: this.selected.userData.aY,
            xRadius: this.selected.userData.xRadius,
            yRadius: this.selected.userData.yRadius,
            aStartAngle: this.selected.userData.aStartAngle,
            aEndAngle: this.selected.userData.aEndAngle,
            aClockwise: this.selected.userData.aClockwise,
            aRotation: this.selected.userData.aRotation,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation } = Object.assign({}, this.state, {
            [name]: value,
        });

        Object.assign(this.selected.userData, {
            aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation
        });

        this.selected.update();

        app.call('objectChanged', this, this.selected);
    }
}

export default EllipseCurveComponent;