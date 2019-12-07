import { MenuItem, MenuItemSeparator } from '../../third_party';

// basic
import SvgAnchor from '../../visual/basic/SvgAnchor.jsx';
import SvgCircle from '../../visual/basic/SvgCircle.jsx';
import SvgEllipse from '../../visual/basic/SvgEllipse.jsx';

/**
 * 数据可视化菜单
 * @author tengge / https://github.com/tengge1
 */
class VisualMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddCircle = this.handleAddCircle.bind(this);
        this.handleAddEllipse = this.handleAddEllipse.bind(this);
    }

    render() {
        return <MenuItem title={_t('Visual')}>
            <MenuItem title={_t('Basic Shape')}>
                <MenuItem title={_t('SVG Circle')}
                    onClick={this.handleAddCircle}
                />
                <MenuItem title={_t('SVG Ellipse')}
                    onClick={this.handleAddEllipse}
                />
            </MenuItem>
        </MenuItem>;
    }

    handleAddCircle() {
        const circle = React.createElement(SvgCircle);
        app.visual.add(circle);
    }

    handleAddEllipse() {
        const ellipse = React.createElement(SvgEllipse);
        app.visual.add(ellipse);
    }
}

export default VisualMenu;