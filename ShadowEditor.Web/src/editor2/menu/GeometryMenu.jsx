import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 几何体菜单
 * @author tengge / https://github.com/tengge1
 */
class GeometryMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        alert('Hello, world!');
    }

    render() {
        return <MenuItem title={L_GEOMETRY}>
            <MenuItem title={L_GROUP}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_PLANE}></MenuItem>
            <MenuItem title={L_BOX}></MenuItem>
            <MenuItem title={L_CIRCLE}></MenuItem>
            <MenuItem title={L_CYLINDER}></MenuItem>
            <MenuItem title={L_SPHERE}></MenuItem>
            <MenuItem title={L_ICOSAHEDRON}></MenuItem>
            <MenuItem title={L_TORUS}></MenuItem>
            <MenuItem title={L_TORUS_KNOT}></MenuItem>
            <MenuItem title={L_TEAPOT}></MenuItem>
            <MenuItem title={L_LATHE}></MenuItem>
            <MenuItem title={L_SPRITE}></MenuItem>
            <MenuItem title={L_TEXT}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={L_LINE_CURVE}></MenuItem>
            <MenuItem title={L_CATMULL_ROM_CURVE}></MenuItem>
            <MenuItem title={L_QUADRATIC_BEZIER_CURVE}></MenuItem>
            <MenuItem title={L_CUBIC_BEZIER_CURVE}></MenuItem>
            <MenuItem title={L_ELLIPSE_CURVE}></MenuItem>
        </MenuItem>;
    }
}

export default GeometryMenu;