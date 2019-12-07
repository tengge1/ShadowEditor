import { MenuItem, MenuItemSeparator } from '../../third_party';

// basic
import SvgAnchor from '../../visual/basic/SvgAnchor.jsx';
import SvgCircle from '../../visual/basic/SvgCircle.jsx';
import SvgEllipse from '../../visual/basic/SvgEllipse.jsx';
import SvgLine from '../../visual/basic/SvgLine.jsx';

/**
 * 数据可视化菜单
 * @author tengge / https://github.com/tengge1
 */
class VisualMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddCircle = this.handleAddCircle.bind(this);
        this.handleAddEllipse = this.handleAddEllipse.bind(this);
        this.handleAddLine = this.handleAddLine.bind(this);
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
                <MenuItem title={_t('SVG Line')}
                    onClick={this.handleAddLine}
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

    handleAddLine() {
        const line = React.createElement(SvgLine);
        app.visual.add(line);
    }
}

export default VisualMenu;