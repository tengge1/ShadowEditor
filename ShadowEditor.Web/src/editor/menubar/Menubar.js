import UI from '../../ui/UI';
import Logo from './Logo';
import SceneMenu from './SceneMenu';
import EditMenu from './EditMenu';
import TwoDMenu from './TwoDMenu';
import GeometryMenu from './GeometryMenu';
import LightMenu from './LightMenu';
import AssetMenu from './AssetMenu';
// import TerrainMenu from './TerrainMenu';
import ComponentMenu from './ComponentMenu';
import VisualMenu from './VisualMenu';
import PlayMenu from './PlayMenu';
import ToolMenu from './ToolMenu';
import OptionsMenu from './OptionsMenu';
import HelpMenu from './HelpMenu';
import StatusMenu from './StatusMenu';

/**
 * 菜单栏
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function Menubar(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

Menubar.prototype = Object.create(UI.Control.prototype);
Menubar.prototype.constructor = Menubar;

Menubar.prototype.render = function () {
    var params = {
        app: this.app
    };

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
            new GeometryMenu(params),
            new TwoDMenu(params),
            new LightMenu(params),
            new AssetMenu(params),
            //new TerrainMenu(params),
            new ComponentMenu(params),
            new VisualMenu(params),
            new PlayMenu(params),
            new ToolMenu(params),
            new OptionsMenu(params),
            new HelpMenu(params),

            // 右侧
            new StatusMenu(params)
        ]
    });

    container.render();
};

export default Menubar;