import { classNames, MenuBar, MenuBarFiller, MenuItemSeparator } from '../../third_party';
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
        const { enableAuthority, isLogin, isAdmin } = app.server;

        return <MenuBar className={classNames('EditorMenuBar', className)}>
            {!enableAuthority || isLogin ? <SceneMenu /> : null}
            {!enableAuthority || isLogin ? <EditMenu /> : null}
            {!enableAuthority || isLogin ? <TwoDMenu /> : null}
            {!enableAuthority || isLogin ? <GeometryMenu /> : null}
            {!enableAuthority || isLogin ? <LightMenu /> : null}
            {!enableAuthority || isLogin ? <AssetsMenu /> : null}
            {!enableAuthority || isLogin ? <ComponentMenu /> : null}
            {enableAuthority && isAdmin ? <SystemMenu /> : null}
            <PlayMenu />
            {!enableAuthority || isAdmin ? <ToolMenu /> : null}
            <OptionsMenu />
            <HelpMenu />
            <MenuItemSeparator direction={'horizontal'} />
            {/* <EditorTabMenu /> */}
            <MenuBarFiller />
            {enableAuthority && <LoginMenu />}
        </MenuBar>;
    }
}

export default EditorMenuBar;