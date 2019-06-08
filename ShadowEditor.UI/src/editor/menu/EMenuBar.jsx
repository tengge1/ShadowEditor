import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import MenuBar from '../../menu/MenuBar.jsx';
import MenuItem from '../../menu/MenuItem.jsx';

import SceneMenu from './SceneMenu.jsx';
import EditMenu from './EditMenu.jsx';
import TwoDMenu from './TwoDMenu.jsx';
import GeometryMenu from './GeometryMenu.jsx';
import LightMenu from './LightMenu.jsx';
import AssetsMenu from './AssetsMenu.jsx';
import ComponentMenu from './ComponentMenu.jsx';
import PlayMenu from './PlayMenu.jsx';
import ToolMenu from './ToolMenu.jsx';
import OptionsMenu from './OptionsMenu.jsx';
import HelpMenu from './HelpMenu.jsx';

/**
 * 菜单栏
 * @author tengge / https://github.com/tengge1
 */
class EMenuBar extends React.Component {
    render() {
        const { className, ...others } = this.props;

        return <MenuBar className={classNames('EMenuBar', className)} {...others}>
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
};

export default EMenuBar;