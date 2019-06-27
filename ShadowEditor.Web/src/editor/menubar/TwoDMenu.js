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
import Histogram from '../../visual/component/Histogram';
import LineChart from '../../visual/component/LineChart';
import SideBar from '../../visual/component/SideBar';
import Histogram2 from '../../visual/component/Histogram2';
import ScatterPlot from '../../visual/component/ScatterPlot';
import PieChart from '../../visual/component/PieChart';
import ChordGraph from '../../visual/component/ChordGraph';
import ForceDirectedGraph from '../../visual/component/ForceDirectedGraph';
import TreeDiagram from '../../visual/component/TreeDiagram';
import ClusterDiagram from '../../visual/component/ClusterDiagram';
import PackDiagram from '../../visual/component/PackDiagram';
import PartitionDiagram from '../../visual/component/PartitionDiagram';

/**
 * 二维菜单
 * @author tengge / https://github.com/tengge1
 * @param {*} options 
 */
function TwoDMenu(options) {
    UI.Control.call(this, options);
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
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_HISTOGRAM,
                onClick: this.addHistogram.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_LINECHART,
                onClick: this.addLineChart.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_SIDEBAR,
                onClick: this.addSideBar.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_HISTOGRAM + '2',
                onClick: this.addHistogram2.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_SCATTER_PLOT,
                onClick: this.addScatterPlot.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_PIE_CHART,
                onClick: this.addPieChart.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_CHORD_GRAPH,
                onClick: this.addChordGraph.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_FORCE_DIRECTED_GRAPH,
                onClick: this.addForceDirectedGraph.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_TREE_DIAGRAM,
                onClick: this.addTreeDiagram.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_CLUSTER_DIAGRAM,
                onClick: this.addClusterDiagram.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_PACK_DIAGRAM,
                onClick: this.addPackDiagram.bind(this),
            }, {
                xtype: 'div',
                cls: 'option',
                html: L_PARTITION_DIAGRAM,
                onClick: this.addPartitionDiagram.bind(this),
            }]
        }]
    });

    container.render();
};

// ------------------------------ 按钮 --------------------------------

TwoDMenu.prototype.addButton = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new Button());
    visual.render(svg);
};

// ---------------------------- 标签 -----------------------------------

TwoDMenu.prototype.addLabel = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new Label());
    visual.render(svg);
};

// ---------------------------- 面板 ------------------------------------

TwoDMenu.prototype.addPanel = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new Panel());
    visual.render(svg);
};

// --------------------------- 水平线 -------------------------------------

TwoDMenu.prototype.addHorizontalLine = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new HorizontalLine());
    visual.render(svg);
};

// ---------------------------- 条形图 -------------------------------------

TwoDMenu.prototype.addBarChart = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new BarChart());
    visual.render(svg);
};

// --------------------------- 时间标签 --------------------------------------

TwoDMenu.prototype.addTimeLabel = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new TimeLabel());
    visual.render(svg);
};

// --------------------------- 垂直线 ------------------------------------------

TwoDMenu.prototype.addVerticalLine = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new VerticalLine());
    visual.render(svg);
};

// -------------------------- 日期时间 -------------------------------------------

TwoDMenu.prototype.addDateWeek = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new DateWeekLabel());
    visual.render(svg);
};

// ------------------------- 时间圆盘 -----------------------------------------------

TwoDMenu.prototype.addTimeDisk = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new TimeDisk());
    visual.render(svg);
};

// -------------------------- 键值标签 -------------------------------------------------

TwoDMenu.prototype.addKeyValueLabel = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new KeyValueLabel());
    visual.render(svg);
};

// --------------------------- 表单 ------------------------------------------------------

TwoDMenu.prototype.addFormPanel = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new FormPanel());
    visual.render(svg);
};

// ---------------------------- 仪表 --------------------------------------------

TwoDMenu.prototype.addGauge = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new Gauge());
    visual.render(svg);
};

// --------------------------- 柱状图 ----------------------------------------------

TwoDMenu.prototype.addHistogram = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new Histogram());
    visual.render(svg);
};

// ------------------------------- 折线图 ----------------------------------------------

TwoDMenu.prototype.addLineChart = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new LineChart());
    visual.render(svg);
};

// -------------------------------- 侧边栏 ---------------------------------------------

TwoDMenu.prototype.addSideBar = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new SideBar());
    visual.render(svg);
};

// ------------------------------- 柱状图2 ------------------------------------------------

TwoDMenu.prototype.addHistogram2 = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new Histogram2());
    visual.render(svg);
};

// -------------------------------- 散点图 ---------------------------------------------------

TwoDMenu.prototype.addScatterPlot = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new ScatterPlot());
    visual.render(svg);
};

// --------------------------------- 饼状图 --------------------------------------------------

TwoDMenu.prototype.addPieChart = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new PieChart());
    visual.render(svg);
};

// --------------------------------- 弦图 --------------------------------------------------

TwoDMenu.prototype.addChordGraph = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new ChordGraph());
    visual.render(svg);
};

// ----------------------------------- 力导向图 ---------------------------------------------

TwoDMenu.prototype.addForceDirectedGraph = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new ForceDirectedGraph());
    visual.render(svg);
};

// ----------------------------------- 树状图 -----------------------------------------------

TwoDMenu.prototype.addTreeDiagram = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new TreeDiagram());
    visual.render(svg);
};

// ---------------------------------- 集群图 -----------------------------------------------------

TwoDMenu.prototype.addClusterDiagram = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new ClusterDiagram());
    visual.render(svg);
};

// ------------------------------- 包图 -----------------------------------------

TwoDMenu.prototype.addPackDiagram = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new PackDiagram());
    visual.render(svg);
};

// --------------------------------- 分区图 --------------------------------------------

TwoDMenu.prototype.addPartitionDiagram = function () {
    var visual = app.editor.visual;
    var svg = app.editor.svg;

    visual.add(new PartitionDiagram());
    visual.render(svg);
};

export default TwoDMenu;