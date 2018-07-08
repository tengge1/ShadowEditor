import Control from '../ui/Control';
import Div from '../ui/Div';

import SceneMenu from './menubar/SceneMenu';
import EditMenu from './menubar/EditMenu';
import AddMenu from './menubar/AddMenu';
import AssetMenu from './menubar/AssetMenu';
import ParticleMenu from './menubar/ParticleMenu';
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

    Control.call(this, { parent: this.app.container });

    this.children = [
        // 左侧
        new SceneMenu({ app: this.app }),
        new EditMenu({ app: this.app }),
        new AddMenu({ app: this.app }),
        new AssetMenu({ app: this.app }),
        new ParticleMenu({ app: this.app }),
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
    this.dom = new Div({
        parent: this.parent,
        id: 'menubar',
        children: this.children
    });

    this.dom.render();
};

export default Menubar;