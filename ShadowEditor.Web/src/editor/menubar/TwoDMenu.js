import UI from '../../ui/UI';
import Button from '../../visual/component/Button';
import Label from '../../visual/component/Label';
import Panel from '../../visual/component/Panel';
import HorizontalLine from '../../visual/component/HorizontalLine';
import BarChart from '../../visual/component/BarChart';
import TimeLabel from '../../visual/component/TimeLabel';
import VerticalLine from '../../visual/component/VerticalLine';
import DateWeekLabel from '../../visual/component/DateWeekLabel';
import TimeDisk from '../../visual/component/TimeDisk';
import KeyValueLabel from '../../visual/component/KeyValueLabel';
import FormPanel from '../../visual/component/FormPanel';
import Gauge from '../../visual/component/Gauge';

/**
 * 二维菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TwoDMenu(options) {
    UI.Control.call(this, options);
    this.app = options.app;
}

TwoDMenu.prototype = Object.create(UI.Control.prototype);
TwoDMenu.prototype.constructor = TwoDMenu;

TwoDMenu.prototype.render = function () {
    var container = UI.create({
        xtype: 'div',
        parent: this.parent,
        cls: 'menu',
        children: [{
            xtype: 'div',
            cls: 'title',
            html: L_TWO_D
        }, {
            xtype: 'div',
            cls: 'options',
            children: [{
                xtype: 'div',
                cls: 'option',
                html: L_BUTTON,
                onClick: this.addButton.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_LABEL,
                onClick: this.addLabel.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_PANEL,
                onClick: this.addPanel.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_HORIZONTAL_LINE,
                onClick: this.addHorizontalLine.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_BAR_CHART,
                onClick: this.addBarChart.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_TIME,
                onClick: this.addTimeLabel.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_VERTICAL_LINE,
                onClick: this.addVerticalLine.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_DATE_WEEK,
                onClick: this.addDateWeek.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_TIME_DISK,
                onClick: this.addTimeDisk.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_KEY_VALUE_LABEL,
                onClick: this.addKeyValueLabel.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_FORM_PANEL,
                onClick: this.addFormPanel.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_GAUGE,
                onClick: this.addGauge.bind(this),
            }]
        }]
    });

    container.render();
};

// ------------------------------ 按钮 --------------------------------

TwoDMenu.prototype.addButton = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new Button());
    visual.render(svg);
};

// ---------------------------- 标签 -----------------------------------

TwoDMenu.prototype.addLabel = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new Label());
    visual.render(svg);
};

// ---------------------------- 面板 ------------------------------------

TwoDMenu.prototype.addPanel = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new Panel());
    visual.render(svg);
};

// --------------------------- 水平线 -------------------------------------

TwoDMenu.prototype.addHorizontalLine = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new HorizontalLine());
    visual.render(svg);
};

// ---------------------------- 条形图 -------------------------------------

TwoDMenu.prototype.addBarChart = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new BarChart());
    visual.render(svg);
};

// --------------------------- 时间标签 --------------------------------------

TwoDMenu.prototype.addTimeLabel = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new TimeLabel());
    visual.render(svg);
};

// --------------------------- 垂直线 ------------------------------------------

TwoDMenu.prototype.addVerticalLine = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new VerticalLine());
    visual.render(svg);
};

// -------------------------- 日期时间 -------------------------------------------

TwoDMenu.prototype.addDateWeek = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new DateWeekLabel());
    visual.render(svg);
};

// ------------------------- 时间圆盘 -----------------------------------------------

TwoDMenu.prototype.addTimeDisk = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new TimeDisk());
    visual.render(svg);
};

// -------------------------- 键值标签 -------------------------------------------------

TwoDMenu.prototype.addKeyValueLabel = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new KeyValueLabel());
    visual.render(svg);
};

// --------------------------- 表单 ------------------------------------------------------

TwoDMenu.prototype.addFormPanel = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new FormPanel());
    visual.render(svg);
};

// ---------------------------- 仪表 --------------------------------------------

TwoDMenu.prototype.addGauge = function () {
    var visual = this.app.editor.visual;
    var svg = this.app.editor.svg;

    visual.add(new Gauge());
    visual.render(svg);
};

export default TwoDMenu;