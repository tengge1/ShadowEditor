import BaseComponent from '../BaseComponent';

/**
 * 饼状图
 * @author tengge / https://github.com/tengge1
 */
function PieChart() {
    BaseComponent.call(this);
    this.type = 'PieChart';

    this.width = 400;
    this.height = 400;
    this.title = 'PieChart';

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

PieChart.prototype = Object.create(BaseComponent.prototype);
PieChart.prototype.constructor = PieChart;

PieChart.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

PieChart.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('ScatterPlot', true)
        .style('pointer-events', 'all');

    var dataset = [{
        startAngle: 0,
        endAngle: Math.PI * 0.6,
    }, {
        startAngle: Math.PI * 0.6,
        endAngle: Math.PI,
    }, {
        startAngle: Math.PI,
        endAngle: Math.PI * 1.7,
    }, {
        startAngle: Math.PI * 1.7,
        endAngle: Math.PI * 2,
    }];

    var width = 400;
    var height = 400

    var arcPath = d3.arc()
        .innerRadius(50)
        .outerRadius(100);

    g.selectAll('path')
        .data(dataset)
        .enter()
        .append('path')
        .attr('data-id', this.id)
        .attr('d', function (d) {
            return arcPath(d);
        })
        .attr('transform', 'translate(250, 250)')
        .attr('stroke', 'black')
        .attr('stroke-width', '2px')
        .attr('fill', function (d, i) {
            return d3.schemeCategory10[i];
        });

    g.selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .attr('data-id', this.id)
        .attr('transform', function (d) {
            return 'translate(250, 250) ' +
                'translate(' + arcPath.centroid(d) + ')';
        })
        .attr('text-anchor', 'middle')
        .attr('fill', '#fff')
        .attr('font-size', '18px')
        .text(function (d) {
            return Math.floor((d.endAngle - d.startAngle) * 180 / Math.PI) + '°';
        });

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

PieChart.prototype.toJSON = function () {
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

PieChart.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.data = data;
    this.transform = json.transform || null;
};

PieChart.prototype.clear = function () {
    this.title = 'PieChart';
    this.transform = null;

    delete this.dom;
};

export default PieChart;