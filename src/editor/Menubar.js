import UI from '../ui/UI';
import Logo from './menubar/Logo';
import SceneMenu from './menubar/SceneMenu';
import EditMenu from './menubar/EditMenu';
import AddMenu from './menubar/AddMenu';
import AssetMenu from './menubar/AssetMenu';
import AnimationMenu from './menubar/AnimationMenu';
import PlayMenu from './menubar/PlayMenu';
import ViewMenu from './menubar/ViewMenu';
import ExampleMenu from './menubar/ExampleMenu';
import HelpMenu from './menubar/HelpMenu';
import StatusMenu from './menubar/StatusMenu';

/**
 * 菜单栏
 * @author mrdoob / http://mrdoob.com/
 */
function Menubar(app) {
    this.app = app;

    UI.Control.call(this, { parent: this.app.container });

    this.children = [
        // Logo
        new Logo({ app: this.app }),

        // 左侧
        new SceneMenu({ app: this.app }),
        new EditMenu({ app: this.app }),
        new AddMenu({ app: this.app }),
        new AssetMenu({ app: this.app }),
        new AnimationMenu({ app: this.app }),
        new PlayMenu({ app: this.app }),
        new ViewMenu({ app: this.app }),
        new ExampleMenu({ app: this.app }),
        new HelpMenu({ app: this.app }),

        // 右侧
        new StatusMenu({ app: this.app })
    ];
};

Menubar.prototype = Object.create(Control.prototype);
Menubar.prototype.constructor = Menubar;

Menubar.prototype.render = function () {
    this.dom = UI.create({
        xtype: 'div',
        id: 'menubar',
        parent: this.parent,
        children: this.children
    });

    this.dom.render();
};

export default Menubar;