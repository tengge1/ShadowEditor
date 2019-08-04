import { PropertyGrid, PropertyGroup, TextProperty, DisplayProperty, CheckBoxProperty, NumberProperty, IntegerProperty, SelectProperty } from '../../../third_party';

/**
 * GIS基本组件
 * @author tengge / https://github.com/tengge1
 */
class CatmullRomCurveComponent extends React.Component {
    constructor(props) {
        super(props);

        this.selected = null;

        this.bakcground = {
            google: L_GOOGLE_MAP,
            bing: L_BING_MAP,
            tianditu: L_TIANDITU_MAP,
        };

        this.state = {
            show: false,
            expanded: true,
            bakcground: 'google',
        };

        this.handleExpand = this.handleExpand.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const { show, expanded, bakcground } = this.state;

        if (!show) {
            return null;
        }

        return <PropertyGroup title={L_CATMULL_ROM_CURVE} show={show} expanded={expanded} onExpand={this.handleExpand}>
            <SelectProperty label={L_TILE_MAP} options={this.bakcground} name={'bakcground'} value={bakcground} onChange={this.handleChange}></SelectProperty>
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

        if (!editor.selected || editor.selected.userData.type !== 'Globe') {
            this.setState({
                show: false,
            });
            return;
        }

        this.selected = editor.selected;

        this.setState({
            show: true,
            bakcground: this.selected.getBackground(),
        });
    }

    handleChange(value, name) {
        if (value === null) {
            this.setState({
                [name]: value,
            });
            return;
        }

        const { bakcground } = Object.assign({}, this.state, {
            [name]: value,
        });

        this.selected.setBackground(bakcground);

        app.call('objectChanged', this, this.selected);
    }
}

export default CatmullRomCurveComponent;