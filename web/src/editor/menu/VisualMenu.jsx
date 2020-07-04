/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import { MenuItem } from '../../ui/index';

// basic/shape
import SvgCircle from '../../visual/basic/shape/SvgCircle.jsx';
import SvgEllipse from '../../visual/basic/shape/SvgEllipse.jsx';
import SvgLine from '../../visual/basic/shape/SvgLine.jsx';
import SvgPath from '../../visual/basic/shape/SvgPath.jsx';
import SvgPolygon from '../../visual/basic/shape/SvgPolygon.jsx';
import SvgPolyline from '../../visual/basic/shape/SvgPolyline.jsx';
import SvgRect from '../../visual/basic/shape/SvgRect.jsx';

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
        this.handleAddPolyline = this.handleAddPolyline.bind(this);
        this.handleAddRect = this.handleAddRect.bind(this);
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
                <MenuItem title={_t('SVG Polyline')}
                    onClick={this.handleAddPolyline}
                />
                <MenuItem title={_t('SVG Rect')}
                    onClick={this.handleAddRect}
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

    handleAddPolyline() {
        const polyline = React.createElement(SvgPolyline);
        app.visual.add(polyline);
    }

    handleAddRect() {
        const rect = React.createElement(SvgRect);
        app.visual.add(rect);
    }
}

export default VisualMenu;