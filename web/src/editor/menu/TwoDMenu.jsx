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
 * 2D菜单
 * @author tengge / https://github.com/tengge1
 */
class TwoDMenu extends React.Component {
    constructor(props) {
        super(props);

        this.handleAddButton = this.handleAddButton.bind(this);
        this.handleAddLabel = this.handleAddLabel.bind(this);
        this.handleAddPanel = this.handleAddPanel.bind(this);
        this.handleAddHorizontalLine = this.handleAddHorizontalLine.bind(this);
        this.handleAddBarChart = this.handleAddBarChart.bind(this);
        this.handleAddTimeLabel = this.handleAddTimeLabel.bind(this);
        this.handleAddVerticalLine = this.handleAddVerticalLine.bind(this);
        this.handleAddDateWeek = this.handleAddDateWeek.bind(this);
        this.handleAddTimeDisk = this.handleAddTimeDisk.bind(this);
        this.handleAddKeyValueLabel = this.handleAddKeyValueLabel.bind(this);
        this.handleAddFormPanel = this.handleAddFormPanel.bind(this);
        this.handleAddGauge = this.handleAddGauge.bind(this);
        this.handleAddHistogram = this.handleAddHistogram.bind(this);
        this.handleAddLineChart = this.handleAddLineChart.bind(this);
        this.handleAddSideBar = this.handleAddSideBar.bind(this);
        this.handleAddHistogram2 = this.handleAddHistogram2.bind(this);
        this.handleAddScatterPlot = this.handleAddScatterPlot.bind(this);
        this.handleAddPieChart = this.handleAddPieChart.bind(this);
        this.handleAddChordGraph = this.handleAddChordGraph.bind(this);
        this.handleAddForceDirectedGraph = this.handleAddForceDirectedGraph.bind(this);
        this.handleAddTreeDiagram = this.handleAddTreeDiagram.bind(this);
        this.handleAddClusterDiagram = this.handleAddClusterDiagram.bind(this);
        this.handleAddPackDiagram = this.handleAddPackDiagram.bind(this);
        this.handleAddPartitionDiagram = this.handleAddPartitionDiagram.bind(this);
    }

    render() {
        return <MenuItem title={_t('2D')}
            show={app.debug === true}
               >
            <MenuItem title={_t('Button')}
                onClick={this.handleAddButton}
            />
            <MenuItem title={_t('Label')}
                onClick={this.handleAddLabel}
            />
            <MenuItem title={_t('Panel')}
                onClick={this.handleAddPanel}
            />
            <MenuItem title={_t('Horizontal Line')}
                onClick={this.handleAddHorizontalLine}
            />
            <MenuItem title={_t('Bar Chart')}
                onClick={this.handleAddBarChart}
            />
            <MenuItem title={_t('Time')}
                onClick={this.handleAddTimeLabel}
            />
            <MenuItem title={_t('Vertical Line')}
                onClick={this.handleAddVerticalLine}
            />
            <MenuItem title={_t('Date')}
                onClick={this.handleAddDateWeek}
            />
            <MenuItem title={_t('Time Disk')}
                onClick={this.handleAddTimeDisk}
            />
            <MenuItem title={_t('Key Value Label')}
                onClick={this.handleAddKeyValueLabel}
            />
            <MenuItem title={_t('Form Panel')}
                onClick={this.handleAddFormPanel}
            />
            <MenuItem title={_t('Gauge')}
                onClick={this.handleAddGauge}
            />
            <MenuItem title={_t('Histogram')}
                onClick={this.handleAddHistogram}
            />
            <MenuItem title={_t('Line Chart')}
                onClick={this.handleAddLineChart}
            />
            <MenuItem title={_t('Sidebar')}
                onClick={this.handleAddSideBar}
            />
            <MenuItem title={`${_t('Histogram')}2`}
                onClick={this.handleAddHistogram2}
            />
            <MenuItem title={_t('Scatter Plot')}
                onClick={this.handleAddScatterPlot}
            />
            <MenuItem title={_t('Pie Chart')}
                onClick={this.handleAddPieChart}
            />
            <MenuItem title={_t('Chord Graph')}
                onClick={this.handleAddChordGraph}
            />
            <MenuItem title={_t('Force Directed Graph')}
                onClick={this.handleAddForceDirectedGraph}
            />
            <MenuItem title={_t('Tree Diagram')}
                onClick={this.handleAddTreeDiagram}
            />
            <MenuItem title={_t('Cluster Diagram')}
                onClick={this.handleAddClusterDiagram}
            />
            <MenuItem title={_t('Pack Diagram')}
                onClick={this.handleAddPackDiagram}
            />
            <MenuItem title={_t('Partition Diagram')}
                onClick={this.handleAddPartitionDiagram}
            />
        </MenuItem>;
    }

    // ------------------------------ 按钮 --------------------------------

    handleAddButton() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new Button());
        visual.render(svg);
    }

    // ---------------------------- 标签 -----------------------------------

    handleAddLabel() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new Label());
        visual.render(svg);
    }

    // ---------------------------- 面板 ------------------------------------

    handleAddPanel() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new Panel());
        visual.render(svg);
    }

    // --------------------------- 水平线 -------------------------------------

    handleAddHorizontalLine() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new HorizontalLine());
        visual.render(svg);
    }

    // ---------------------------- 条形图 -------------------------------------

    handleAddBarChart() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new BarChart());
        visual.render(svg);
    }

    // --------------------------- 时间标签 --------------------------------------

    handleAddTimeLabel() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new TimeLabel());
        visual.render(svg);
    }

    // --------------------------- 垂直线 ------------------------------------------

    handleAddVerticalLine() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new VerticalLine());
        visual.render(svg);
    }

    // -------------------------- 日期时间 -------------------------------------------

    handleAddDateWeek() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new DateWeekLabel());
        visual.render(svg);
    }

    // ------------------------- 时间圆盘 -----------------------------------------------

    handleAddTimeDisk() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new TimeDisk());
        visual.render(svg);
    }

    // -------------------------- 键值标签 -------------------------------------------------

    handleAddKeyValueLabel() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new KeyValueLabel());
        visual.render(svg);
    }

    // --------------------------- 表单 ------------------------------------------------------

    handleAddFormPanel() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new FormPanel());
        visual.render(svg);
    }

    // ---------------------------- 仪表 --------------------------------------------

    handleAddGauge() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new Gauge());
        visual.render(svg);
    }

    // --------------------------- 柱状图 ----------------------------------------------

    handleAddHistogram() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new Histogram());
        visual.render(svg);
    }

    // ------------------------------- 折线图 ----------------------------------------------

    handleAddLineChart() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new LineChart());
        visual.render(svg);
    }

    // -------------------------------- 侧边栏 ---------------------------------------------

    handleAddSideBar() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new SideBar());
        visual.render(svg);
    }

    // ------------------------------- 柱状图2 ------------------------------------------------

    handleAddHistogram2() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new Histogram2());
        visual.render(svg);
    }

    // -------------------------------- 散点图 ---------------------------------------------------

    handleAddScatterPlot() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new ScatterPlot());
        visual.render(svg);
    }

    // --------------------------------- 饼状图 --------------------------------------------------

    handleAddPieChart() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new PieChart());
        visual.render(svg);
    }

    // --------------------------------- 弦图 --------------------------------------------------

    handleAddChordGraph() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new ChordGraph());
        visual.render(svg);
    }

    // ----------------------------------- 力导向图 ---------------------------------------------

    handleAddForceDirectedGraph() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new ForceDirectedGraph());
        visual.render(svg);
    }

    // ----------------------------------- 树状图 -----------------------------------------------

    handleAddTreeDiagram() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new TreeDiagram());
        visual.render(svg);
    }

    // ---------------------------------- 集群图 -----------------------------------------------------

    handleAddClusterDiagram() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new ClusterDiagram());
        visual.render(svg);
    }

    // ------------------------------- 包图 -----------------------------------------

    handleAddPackDiagram() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new PackDiagram());
        visual.render(svg);
    }

    // --------------------------------- 分区图 --------------------------------------------

    handleAddPartitionDiagram() {
        var visual = app.editor.visual;
        var svg = app.editor.svg;

        visual.add(new PartitionDiagram());
        visual.render(svg);
    }
}

export default TwoDMenu;