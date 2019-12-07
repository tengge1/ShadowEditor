import { MenuItem, MenuItemSeparator } from '../../third_party';

// basic
import SvgAnchor from '../../visual/basic/SvgAnchor.jsx';
import SvgCircle from '../../visual/basic/SvgCircle.jsx';
import SvgEllipse from '../../visual/basic/SvgEllipse.jsx';
import SvgLine from '../../visual/basic/SvgLine.jsx';
import SvgPath from '../../visual/basic/SvgPath.jsx';
import SvgPolygon from '../../visual/basic/SvgPolygon.jsx';

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
        this.handleAddPath = this.handleAddPath.bind(this);
        this.handleAddPolygon = this.handleAddPolygon.bind(this);
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
                <MenuItem title={_t('SVG Path')}
                    onClick={this.handleAddPath}
                />
                <MenuItem title={_t('SVG Polygon')}
                    onClick={this.handleAddPolygon}
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

    handleAddPath() {
        const path = React.createElement(SvgPath);
        app.visual.add(path);
    }

    handleAddPolygon() {
        const polygon = React.createElement(SvgPolygon);
        app.visual.add(polygon);
    }
}

export default VisualMenu;