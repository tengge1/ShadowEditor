import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty, ButtonsProperty, Button } from '../../../third_party';

/**
 * CatmullRom曲线组件
 * @author tengge / https://github.com/tengge1
 */
class CatmullRomCurveComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.curveType = {
            centripetal: _t('Centripetal Force'),
            chordal: _t('Chord'),
            catmullrom: _t('Catmullrom'),
        };

        this.state = {
            show: false,
            expanded: false,
            closed: true,
            curveType: 'catmullrom',
            tension: 1,
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleAddPoint = this.handleAddPoint.bind(this);
        this.handleRemovePoint = this.handleRemovePoint.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, closed, curveType, tension } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={_t('CatmullRom Curve')} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <ButtonsProperty>
                <Button onClick={this.handleAddPoint}>{_t('Add Point')}</Button>
                <Button onClick={this.handleRemovePoint}>{_t('Remove Point')}</Button>
            </ButtonsProperty>
            <CheckBoxProperty label={_t('Closed')} name={'closed'} value={closed} onChange={this.handleChange}></CheckBoxProperty>
            <SelectProperty label={_t('Curve Type')} options={this.curveType} name={'curveType'} value={curveType} onChange={this.handleChange}></SelectProperty>
            <NumberProperty label={_t('Tension')} name={'tension'} value={tension} onChange={this.handleChange}></NumberProperty>
        </PropertyGroup>;
    }

    componentDidMount() {
        app.on(`objectSelected.CatmullRomCurveComponent`, this.handleUpdate.bind(this));
        app.on(`objectChanged.CatmullRomCurveComponent`, this.handleUpdate.bind(this));
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }

    handleUpdate() {
        const editor = app.editor;

        if (!editor.selected || editor.selected.userData.type !== 'CatmullRomCurve') {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            closed: this.selected.userData.closed,
            curveType: this.selected.userData.curveType,
            tension: this.selected.userData.tension,
        });
    }

    handleAddPoint() {
        let points = this.selected.userData.points;
        let closed = this.selected.userData.closed;
        let curveType = this.selected.userData.curveType;
        let tension = this.selected.userData.tension;

        let curve = new THREE.CatmullRomCurve3(points, closed, curveType, tension);

        let point = new THREE.Vector3(
            parseInt((Math.random() - 0.5) * 40),
            parseInt(Math.random() * 20),
            parseInt((Math.random() - 0.5) * 40)
        );

        points.splice(points.length, 0, point);

        this.selected.update();

        app.call('objectChanged', this, this.selected);
    }

    handleRemovePoint() {
        let points = this.selected.userData.points;

        if (points.length === 3) {
            app.toast(_t('CatmullRom curve should have at least 3 points.'));
            return;
        }

        points.splice(points.length - 1, 1);

        this.selected.update();

        app.call('objectChanged', this, this.selected);
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { closed, curveType, tension } = Object.assign({}, this.state, {
            [name]: value,
        });

        Object.assign(this.selected.userData, {
            closed, curveType, tension
        });

        this.selected.update();

        app.call('objectChanged', this, this.selected);
    }
}

export default CatmullRomCurveComponent;