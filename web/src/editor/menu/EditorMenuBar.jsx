/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { classNames } from '../../third_party';
import { MenuBar, MenuBarFiller, MenuItemSeparator } from '../../ui/index';
import SceneMenu from './SceneMenu.jsx';
import EditMenu from './EditMenu.jsx';
import TwoDMenu from './TwoDMenu.jsx';
import ObjectMenu from './ObjectMenu.jsx';
import LightMenu from './LightMenu.jsx';
import AssetsMenu from './AssetsMenu.jsx';
import ComponentMenu from './ComponentMenu.jsx';
import PlayMenu from './PlayMenu.jsx';
// import VisualMenu from './VisualMenu.jsx';
import ToolMenu from './ToolMenu.jsx';
import ViewMenu from './ViewMenu.jsx';
import ExampleMenu from './ExampleMenu.jsx';
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
            {!enableAuthority || isLogin ? <ObjectMenu /> : null}
            {!enableAuthority || isLogin ? <LightMenu /> : null}
            {!enableAuthority || isLogin ? <AssetsMenu /> : null}
            {!enableAuthority || isLogin ? <ComponentMenu /> : null}
            {enableAuthority && isAdmin ? <SystemMenu /> : null}
            <PlayMenu />
            {/* {!enableAuthority || isAdmin ? <VisualMenu /> : null} */}
            {!enableAuthority || isAdmin ? <ExampleMenu /> : null}
            {!enableAuthority || isAdmin ? <ToolMenu /> : null}
            <ViewMenu />
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