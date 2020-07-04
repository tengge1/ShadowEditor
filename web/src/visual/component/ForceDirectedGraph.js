/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseComponent from '../BaseComponent';

/**
 * 饼状图
 * @author tengge / https://github.com/tengge1
 */
function ForceDirectedGraph() {
    BaseComponent.call(this);
    this.type = 'ForceDirectedGraph';

    this.width = 500;
    this.height = 500;
    this.title = 'ForceDirectedGraph';

    this.transform = null;
}

ForceDirectedGraph.prototype = Object.create(BaseComponent.prototype);
ForceDirectedGraph.prototype.constructor = ForceDirectedGraph;

ForceDirectedGraph.prototype.setTranslate = function (dx, dy) {
    var xy = this.transform.split(',');

    this.transform = `${parseFloat(xy[0]) + dx},${parseFloat(xy[1]) + dy}`;

    this.dom.attr('transform', `translate(${this.transform})`);
};

ForceDirectedGraph.prototype.render = function (parent) {
    if (d3.select(`#${this.id}`).size() > 0) {
        return;
    }

    var g = d3.select(parent)
        .append('g')
        .attr('id', this.id)
        .classed('Visual', true)
        .classed('ScatterPlot', true)
        .style('pointer-events', 'all');

    var dataset = {
        nodes: [
            { name: "Adam" },
            { name: "Bob" },
            { name: "Carrie" },
            { name: "Donovan" },
            { name: "Edward" },
            { name: "Felicity" },
            { name: "George" },
            { name: "Hannah" },
            { name: "Iris" },
            { name: "Jerry" }
        ],
        links: [
            { source: 0, target: 1 },
            { source: 0, target: 2 },
            { source: 0, target: 3 },
            { source: 0, target: 4 },
            { source: 1, target: 5 },
            { source: 2, target: 5 },
            { source: 2, target: 5 },
            { source: 3, target: 4 },
            { source: 5, target: 8 },
            { source: 5, target: 9 },
            { source: 6, target: 7 },
            { source: 7, target: 8 },
            { source: 8, target: 9 }
        ]
    };

    var width = 500;
    var height = 500;

    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    var simulation = d3.forceSimulation(dataset.nodes)
        .force('charge', d3.forceManyBody())
        .force('link', d3.forceLink(dataset.links))
        .force('center', d3.forceCenter(width / 2, height / 2));

    var link = g.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(dataset.links)
        .enter().append('line')
        .attr('stroke', '#ccc')
        .attr('stroke-width', 1);

    var node = g.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(dataset.nodes)
        .enter().append('circle')
        .attr('r', 10)
        .attr('fill', function (d, i) {
            return colors(i);
        })
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    node.append('title')
        .text(function (d) { return d.name; });

    simulation
        .nodes(dataset.nodes)
        .on('tick', ticked);

    simulation.force('link')
        .links(dataset.links);

    function ticked() {
        link
            .attr('x1', function (d) { return d.source.x; })
            .attr('y1', function (d) { return d.source.y; })
            .attr('x2', function (d) { return d.target.x; })
            .attr('y2', function (d) { return d.target.y; });

        node
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; });
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    if (!this.transform) {
        var left = (parent.clientWidth - this.width) / 2;
        var top = (parent.clientHeight - this.height) / 2;
        this.transform = `${left},${top}`;
    }

    g.attr('transform', `translate(${this.transform})`);

    this.dom = g;
};

ForceDirectedGraph.prototype.toJSON = function () {
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
        transform
    };
};

ForceDirectedGraph.prototype.fromJSON = function (json) {
    this.id = json.id;
    this.type = json.type;
    this.title = json.title;
    this.transform = json.transform || null;
};

ForceDirectedGraph.prototype.clear = function () {
    this.title = 'ForceDirectedGraph';
    this.transform = null;

    delete this.dom;
};

export default ForceDirectedGraph;