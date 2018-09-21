/**
 * @author tengge / https://github.com/tengge1
 */

function SvgElement(options) {
    options = options || [];
    this.parent = d3.select(options.parent || document.body);
    this.stroke = options.stroke || null;
    this.strokeWidth = options.strokeWidth || null;
    this.strokeOpacity = options.strokeOpacity || null;
    this.strokeLinecap = options.strokeLinecap || null; // butt, square, round
    this.fill = options.fill || null;
    this.fillOpacity = options.fillOpacity || null;
    this.fillRule = options.fillRule || null; // nonzero, evenodd
    this.opacity = options.opacity || null;
    this.style = options.style || null;
}

SvgElement.prototype.render = function() {

};

SvgElement.prototype.renderStyle = function(selection, scope) {
    return selection
        .attr('stroke', scope.stroke)
        .attr('stroke-width', scope.strokeWidth)
        .attr('stroke-opacity', scope.strokeOpacity)
        .attr('stroke-linecap', scope.strokeLinecap)
        .attr('fill', scope.fill)
        .attr('fill-opacity', scope.fillOpacity)
        .attr('fill-rule', scope.fillRule)
        .attr('opacity', scope.opacity)
        .attr('style', scope.style);
};

export { SvgElement };