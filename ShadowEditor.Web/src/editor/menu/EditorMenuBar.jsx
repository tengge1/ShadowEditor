import { classNames, PropTypes, MenuBar, MenuItem, MenuBarFiller, MenuItemSeparator } from '../../third_party';
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
import SystemMenu from './SystemMenu.jsx';
import HelpMenu from './HelpMenu.jsx';
// import EditorTabMenu from './EditorTabMenu.jsx';
import LoginMenu from './LoginMenu.jsx';

/**
 * 编辑器菜单栏
 * @author tengge / https://github.com/tengge1
 */
class EditorMenuBar extends React.Component {
    render() {
        const { className } = this.props;

        return <MenuBar className={classNames('EditorMenuBar', className)}>
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
            {app.config.enableAuthority && app.config.login && <SystemMenu />}
            <HelpMenu />
            <MenuItemSeparator direction={'horizontal'} />
            {/* <EditorTabMenu /> */}
            <MenuBarFiller />
            {app.config.enableAuthority && <LoginMenu />}
        </MenuBar>;
    }
}

export default EditorMenuBar;