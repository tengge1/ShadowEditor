import PropTypes from 'prop-types';
import MenuBar from '../menu/MenuBar.jsx';
import MenuItem from '../menu/MenuItem.jsx';

import SceneMenu from './menu/SceneMenu.jsx';
import EditMenu from './menu/EditMenu.jsx';
import TwoDMenu from './menu/TwoDMenu.jsx';
import GeometryMenu from './menu/GeometryMenu.jsx';
import LightMenu from './menu/LightMenu.jsx';
import AssetsMenu from './menu/AssetsMenu.jsx';
import ComponentMenu from './menu/ComponentMenu.jsx';
import PlayMenu from './menu/PlayMenu.jsx';
import ToolMenu from './menu/ToolMenu.jsx';
import OptionsMenu from './menu/OptionsMenu.jsx';
import HelpMenu from './menu/HelpMenu.jsx';

/**
 * 菜单栏
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 * @property {String} region 区域
 */
class EMenuBar extends React.Component {
    render() {
        const { className, style, region } = this.props;

        return <MenuBar className={className} region={region} style={style}>
            <SceneMenu />
            <EditMenu />
            <TwoDMenu />
            <GeometryMenu />
            <LightMenu />
            <AssetsMenu />
            <ComponentMenu />
            <PlayMenu />
            <ToolMenu />
            <OptionsMenu />
            <HelpMenu />
        </MenuBar>;
    }
}

EMenuBar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    region: PropTypes.string,
};

export default EMenuBar;