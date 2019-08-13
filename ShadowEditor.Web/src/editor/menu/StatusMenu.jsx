import { classNames, PropTypes, MenuBar, MenuItem } from '../../third_party';

/**
 * 状态菜单
 * @author tengge / https://github.com/tengge1
 */
class StatusMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <MenuItem title={`r${THREE.REVISION}`}></MenuItem>;
    }
}

export default StatusMenu;