import { classNames, PropTypes, MenuBar, MenuItem, MenuItemSeparator } from '../../third_party';

/**
 * 2D菜单
 * @author tengge / https://github.com/tengge1
 */
class TwoDMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event) {
        event.stopPropagation();
        alert('Hello, world!');
    }

    render() {
        const { className, style } = this.props;

        return <MenuItem title={'2D'}>
            <MenuItem title={'Button'}></MenuItem>
            <MenuItem title={'Label'}></MenuItem>
            <MenuItem title={'Panel'}></MenuItem>
            <MenuItem title={'Horizontal Line'}></MenuItem>
            <MenuItem title={'Bar Chart'}></MenuItem>
            <MenuItem title={'Time'}></MenuItem>
            <MenuItem title={'Vertical Line'}></MenuItem>
            <MenuItem title={'Date'}></MenuItem>
            <MenuItem title={'Time Disk'}></MenuItem>
            <MenuItem title={'Key Value Label'}></MenuItem>
            <MenuItem title={'Form Panel'}></MenuItem>
            <MenuItem title={'Gauge'}></MenuItem>
            <MenuItem title={'Histogram'}></MenuItem>
            <MenuItem title={'Line Chart'}></MenuItem>
            <MenuItem title={'Sidebar'}></MenuItem>
            <MenuItem title={'Histogram2'}></MenuItem>
            <MenuItem title={'Scatter Plot'}></MenuItem>
            <MenuItem title={'Pie Chart'}></MenuItem>
            <MenuItem title={'Chord Graph'}></MenuItem>
            <MenuItem title={'Force Directed Graph'}></MenuItem>
            <MenuItem title={'Tree Diagram'}></MenuItem>
            <MenuItem title={'Cluster Diagram'}></MenuItem>
            <MenuItem title={'Pack Diagram'}></MenuItem>
            <MenuItem title={'Partition Diagram'}></MenuItem>
        </MenuItem>;
    }
}

export default TwoDMenu;