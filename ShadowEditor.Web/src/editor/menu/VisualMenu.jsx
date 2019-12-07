import { MenuItem, MenuItemSeparator } from '../../third_party';

// basic
import SvgAnchor from '../../visual/basic/SvgAnchor.jsx';
import SvgCircle from '../../visual/basic/SvgCircle.jsx';

/**
 * 数据可视化菜单
 * @author tengge / https://github.com/tengge1
 */
class VisualMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddAnchor = this.handleAddAnchor.bind(this);
        this.handleAddCircle = this.handleAddCircle.bind(this);
    }

    render() {
        return <MenuItem title={_t('Visual')}>
            <MenuItem title={_t('Basic Shape')}>
                <MenuItem title={_t('SVG Anchor')}
                    onClick={this.handleAddAnchor}
                />
                <MenuItem title={_t('SVG Circle')}
                    onClick={this.handleAddCircle}
                />
            </MenuItem>
        </MenuItem>;
    }

    handleAddAnchor() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new Button());
        visual.render(svg);
    }

    handleAddCircle() {

    }
}

export default VisualMenu;