import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty } from '../../../third_party';

/**
 * 第一视角控制器组件
 * @author tengge / https://github.com/tengge1
 */
class FirstPersonControlComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.state = {
            show: false,
            expanded: false,
            movementSpeed: 10.0,
            lookSpeed: 0.05,
            lookVertical: true,
            autoForward: false,
            activeLook: true,
            heightSpeed: false,
            heightCoef: 1.0,
            heightMin: 0.0,
            heightMax: 1.0,
            constrainVertical: false,
            verticalMin: 0,
            verticalMax: 3.14,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, movementSpeed, lookSpeed, lookVertical, autoForward, activeLook, heightSpeed, heightCoef, heightMin, heightMax,
            constrainVertical, verticalMin, verticalMax } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_FIRST_PERSON_CONTROLS} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <NumberProperty label={L_MOVEMENT_SPEED} name={'movementSpeed'} value={movementSpeed} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_LOOK_SPEED} name={'lookSpeed'} value={lookSpeed} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_LOOK_VERTICAL} name={'lookVertical'} value={lookVertical} onChange={this.handleChange}></CheckBoxProperty>
            <CheckBoxProperty label={L_AUTO_FORWARD} name={'autoForward'} value={autoForward} onChange={this.handleChange}></CheckBoxProperty>
            <CheckBoxProperty label={L_ACTIVE_LOCK} name={'activeLook'} value={activeLook} onChange={this.handleChange}></CheckBoxProperty>
            <CheckBoxProperty label={L_HEIGHT_SPEED} name={'heightSpeed'} value={heightSpeed} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_HEIGHT_COEF} name={'heightCoef'} value={heightCoef} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_HEIGHT_MIN} name={'heightMin'} value={heightMin} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_HEIGHT_MAX} name={'heightMax'} value={heightMax} onChange={this.handleChange}></NumberProperty>
            <CheckBoxProperty label={L_CONSTRAIN_VERTICAL} name={'constrainVertical'} value={constrainVertical} onChange={this.handleChange}></CheckBoxProperty>
            <NumberProperty label={L_VERTICAL_MIN} name={'verticalMin'} value={verticalMin} onChange={this.handleChange}></NumberProperty>
            <NumberProperty label={L_VERTICAL_MAX} name={'verticalMax'} value={verticalMax} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.FirstPersonControlComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.FirstPersonControlComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected !== editor.camera || editor.selected.userData.control !== 'FirstPersonControls') {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        if (this.selected.userData.firstPersonOptions === undefined) {
            this.selected.userData.firstPersonOptions = {
                movementSpeed: 10.0,
                lookSpeed: 0.05,
                lookVertical: true,
                autoForward: false,
                activeLook: true,
                heightSpeed: false,
                heightCoef: 1.0,
                heightMin: 0.0,
                heightMax: 1.0,
                constrainVertical: false,
                verticalMin: 0,
                verticalMax: 3.14,
            };
        }

        this.setState({
            show: true,
            ...this.selected.userData.firstPersonOptions,
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { movementSpeed, lookSpeed, lookVertical, autoForward, activeLook, heightSpeed, heightCoef, heightMin, heightMax,
            constrainVertical, verticalMin, verticalMax } = Object.assign({}, this.state, {
                [name]: value,
            });

        Object.assign(this.selected.userData.firstPersonOptions, {
            movementSpeed, lookSpeed, lookVertical, autoForward, activeLook, heightSpeed, heightCoef, heightMin, heightMax,
            constrainVertical, verticalMin, verticalMax
        });

        app.call('objectChanged', this, this.selected);
    }
}

export default FirstPersonControlComponent;