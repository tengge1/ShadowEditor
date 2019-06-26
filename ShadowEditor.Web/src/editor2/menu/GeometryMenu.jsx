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
        return <MenuItem title={'Geometry'}>
            <MenuItem title={'Group'}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={'Plane'}></MenuItem>
            <MenuItem title={'Box'}></MenuItem>
            <MenuItem title={'Circle'}></MenuItem>
            <MenuItem title={'Cylinder'}></MenuItem>
            <MenuItem title={'Sphere'}></MenuItem>
            <MenuItem title={'Icosahedron'}></MenuItem>
            <MenuItem title={'Torus'}></MenuItem>
            <MenuItem title={'Torus Knot'}></MenuItem>
            <MenuItem title={'Teapot'}></MenuItem>
            <MenuItem title={'Lathe'}></MenuItem>
            <MenuItem title={'Sprite'}></MenuItem>
            <MenuItem title={'Text'}></MenuItem>
            <MenuItemSeparator />
            <MenuItem title={'Line Curve'}></MenuItem>
            <MenuItem title={'CatmullRom Curve'}></MenuItem>
            <MenuItem title={'QuadraticBezier Curve'}></MenuItem>
            <MenuItem title={'CubicBezier Curve'}></MenuItem>
            <MenuItem title={'Ellipse Curve'}></MenuItem>
        </MenuItem>;
    }
}

export default GeometryMenu;