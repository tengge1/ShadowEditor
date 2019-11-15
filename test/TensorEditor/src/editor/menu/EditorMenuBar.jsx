import { classNames, PropTypes, MenuBar, MenuItem, MenuBarFiller, MenuItemSeparator } from '../../third_party';
import SceneMenu from './SceneMenu.jsx';
import EditMenu from './EditMenu.jsx';
import AssetsMenu from './AssetsMenu.jsx';

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
            <AssetsMenu />
        </MenuBar>;
    }
}

export default EditorMenuBar;