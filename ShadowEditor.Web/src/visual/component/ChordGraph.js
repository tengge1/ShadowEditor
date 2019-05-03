import BaseComponent from '../BaseComponent';

/**
 * 弦图
 * @author tengge / https://github.com/tengge1
 */
function ChordGraph() {
    BaseComponent.call(this);
    this.type = 'ChordGraph';

    this.width = 400;
    this.height = 400;
    this.title = 'ChordGraph';

    var data1 = [];
    var data2 = [];

    var ran1 = d3.randomNormal(29, 8);
    var ran2 = d3.randomNormal(72, 20);

    for (var i = 0; i <= 210; i += 10) {
        data1.push([8 + i, ran1()]);
        data2.push([8 + i, ran2()]);
    }

    this.data = [data1, data2];

    this.transform = null;
}

ChordGraph.prototype = Object.create(BaseComponent.prototype);
ChordGraph.prototype.constructor = ChordGraph;

ChordGraph.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

ChordGraph.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('ScatterPlot', true)
        .style('pointer-events', 'all');

    var matrix = [
        [11975, 5871, 8916, 2868],
        [1951, 10048, 2060, 6171],
        [8010, 16145, 8090, 8045],
        [1013, 990, 940, 6907]
    ];

    var width = 400;
    var height = 400;

    var outerRadius = Math.min(width, height) * 0.5 - 40;
    var innerRadius = outerRadius - 30;

    // 定义数值的格式化函数
    var formatValue = d3.formatPrefix(',.0', 1e3);
    // 定义一个chord diagram的布局函数chord()由于通过chord()函数将matrix转换后，matrix实际分成了
    // 两个部分，groups 和 chords ,其中groups 
    // 表示弦图上的弧，称为外弦，groups中的各个元素都被计算用添加上了angle、startAngle、endAngle、index、value
    // 等字段；chords 称为内弦，表示弦图中节点的连线及其权重。chords 里面分为 source 和 target ，分别标识连线的两端。
    var chord = d3.chord()
        // 设置弦片段之间的间隔角度，即chord diagram 图中组成外层圆圈的各个弧段之间的角度
        .padAngle(0.05)
        // 设置数据矩阵matrix 的行内各列的排序顺序为降序排列
        .sortSubgroups(d3.descending);

    // 定义一个弧线的布局函数arc()
    var arc = d3.arc()
        // 设置弧线的内半径
        .innerRadius(innerRadius)
        // 设置弧线的外半径
        .outerRadius(outerRadius);

    // 定义一个弦布局函数ribbon()
    var ribbon = d3.ribbon()
        // 设置弦的半径为弧线的内半径
        .radius(innerRadius);

    // 定义一个颜色函数color(),返回离散的颜色值，即四种颜色
    var color = d3.scaleOrdinal()
        .domain(d3.range(4))
        .range(['#000000', '#FFDD89', '#957244', '#F26223']);

    // 定义一个组元素
    var g1 = g.append('g')
        // 将组元素移动到画布的中心处
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

        // chord(matrix)函数用来将matrix数组转换为chord diagram 所需的数据格式，
        // 通过datum将转换后用于显示弦图的数据绑定到 g元素上；
        .datum(chord(matrix));

    // 定义一组g元素，用来绑定弦图的 groups数据，即弧线
    var group = g1.append('g')
        .attr('class', 'groups')
        .selectAll('g')
        .data(function (chords) { return chords.groups; })
        .enter().append('g');

    // group元素是用来放置弦图的“弧”的
    group.append('path')
        .attr('data-id', this.id)
        // 设置弧的填充色用color函数来获取
        .style('fill', function (d) { return color(d.index); })
        // 设置弧的边缘线用比其填充色较深的颜色来画
        .style('stroke', function (d) { return d3.rgb(color(d.index)).darker(); })
        // 绑定arc布局到group的d属性上，用来画弧
        .attr('d', arc);

    // 定义每段弧上的刻度 元素
    var groupTick = group.selectAll('.group-tick')
        //为每段弧的刻度元素绑定数据，数据为当前弧上的刻度的角度数组
        .data(function (d) { return groupTicks(d, 1e3); })
        .enter().append('g')
        .attr('class', 'group-tick')
        // 根据角度以及外半径定位刻度位置（这里的刻度指的是弦图上外围的小短刻度线）
        .attr('transform', function (d) { return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ') translate(' + outerRadius + ',0)'; });

    // 绘制弦图外围的刻度线
    groupTick.append('line')
        .attr('data-id', this.id)
        .attr('x2', 6);

    // 定义刻度线上的文字
    groupTick
        // 不能被5整除的数字不显示
        .filter(function (d) { return d.value % 5e3 === 0; })
        .append('text')
        .attr('data-id', this.id)
        .attr('x', 8)
        .attr('dy', '.35em')
        .attr('transform', function (d) { return d.angle > Math.PI ? 'rotate(180) translate(-16)' : null; })
        .style('text-anchor', function (d) { return d.angle > Math.PI ? 'end' : null; })
        .text(function (d) { return formatValue(d.value); });

    // 给之前定义的g这个元素添加样式并绑定数据用来画弦图的弦。
    g1.append('g')
        .attr('class', 'ribbons')
        .selectAll('path')
        .data(function (chords) { return chords; })
        .enter().append('path')
        .attr('data-id', this.id)
        .attr('d', ribbon)
        // 弦的填充色是目标点的索引值确定的
        .style('fill', function (d) { return color(d.target.index); })
        .style('stroke', function (d) { return d3.rgb(color(d.target.index)).darker(); });

    // Returns an array of tick angles and values for a given group and step.
    // 该函数用来计算弧上的刻度的角度
    function groupTicks(d, step) {
        // k表示单位弧度
        var k = (d.endAngle - d.startAngle) / d.value;
        return d3.range(0, d.value, step).map(function (value) {
            return { value: value, angle: value * k + d.startAngle };
        });
    }

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

ChordGraph.prototype.toJSON = function () {
    var transform;
    if (this.transform) {
        transform = this.transform
            .replace('translate(', '')
            .replace(')', '');
    }

    return {
        id: this.id,
        type: this.type,
        title: this.title,
        data: this.data,
        transform,
    };
};

ChordGraph.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.data = data;
    this.transform = json.transform || null;
};

ChordGraph.prototype.clear = function () {
    this.title = 'ChordGraph';
    this.transform = null;

    delete this.dom;
};

export default ChordGraph;