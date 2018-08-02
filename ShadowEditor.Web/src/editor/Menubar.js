import UI from '../ui/UI';
import Logo from './menubar/Logo';
import SceneMenu from './menubar/SceneMenu';
import EditMenu from './menubar/EditMenu';
import AddMenu from './menubar/AddMenu';
import AssetMenu from './menubar/AssetMenu';
import AnimationMenu from './menubar/AnimationMenu';
import PhysicsMenu from './menubar/PhysicsMenu';
import ComponentMenu from './menubar/ComponentMenu';
import PlayMenu from './menubar/PlayMenu';
import ViewMenu from './menubar/ViewMenu';
import ExampleMenu from './menubar/ExampleMenu';
import HelpMenu from './menubar/HelpMenu';
import StatusMenu from './menubar/StatusMenu';

/**
 * 菜单栏
 * @author mrdoob / http://mrdoob.com/
 */
function Menubar(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

Menubar.prototype = Object.create(UI.Control.prototype);
Menubar.prototype.constructor = Menubar;

Menubar.prototype.render = function () {
    var params = { app: this.app };

    var container = UI.create({
        xtype: 'div',
        id: 'menubar',
        cls: 'menubar',
        parent: this.parent,
        children: [
            // Logo
            new Logo(params),

            // 左侧
            new SceneMenu(params),
            new EditMenu(params),
            new AddMenu(params),
            new AssetMenu(params),
            new AnimationMenu(params),
            new PhysicsMenu(params),
            new ComponentMenu(params),
            new PlayMenu(params),
            new ViewMenu(params),
            new ExampleMenu(params),
            new HelpMenu(params),

            // 右侧
            new StatusMenu(params)
        ]
    });

    container.render();
};

export default Menubar;