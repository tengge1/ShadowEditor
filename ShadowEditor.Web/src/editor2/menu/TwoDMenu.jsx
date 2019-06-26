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

        return <MenuItem title={L_TWO_D}>
            <MenuItem title={L_BUTTON}></MenuItem>
            <MenuItem title={L_LABEL}></MenuItem>
            <MenuItem title={L_PANEL}></MenuItem>
            <MenuItem title={L_HORIZONTAL_LINE}></MenuItem>
            <MenuItem title={L_BAR_CHART}></MenuItem>
            <MenuItem title={L_TIME}></MenuItem>
            <MenuItem title={L_VERTICAL_LINE}></MenuItem>
            <MenuItem title={L_DATE_WEEK}></MenuItem>
            <MenuItem title={L_TIME_DISK}></MenuItem>
            <MenuItem title={L_KEY_VALUE_LABEL}></MenuItem>
            <MenuItem title={L_FORM_PANEL}></MenuItem>
            <MenuItem title={L_GAUGE}></MenuItem>
            <MenuItem title={L_HISTOGRAM}></MenuItem>
            <MenuItem title={L_LINECHART}></MenuItem>
            <MenuItem title={L_SIDEBAR}></MenuItem>
            <MenuItem title={`${L_HISTOGRAM}2`}></MenuItem>
            <MenuItem title={L_SCATTER_PLOT}></MenuItem>
            <MenuItem title={L_PIE_CHART}></MenuItem>
            <MenuItem title={L_CHORD_GRAPH}></MenuItem>
            <MenuItem title={L_FORCE_DIRECTED_GRAPH}></MenuItem>
            <MenuItem title={L_TREE_DIAGRAM}></MenuItem>
            <MenuItem title={L_CLUSTER_DIAGRAM}></MenuItem>
            <MenuItem title={L_PACK_DIAGRAM}></MenuItem>
            <MenuItem title={L_PARTITION_DIAGRAM}></MenuItem>
        </MenuItem>;
    }
}

export default TwoDMenu;