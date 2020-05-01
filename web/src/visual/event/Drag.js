/**
 * 通用拖动事件
 * @returns {Object} 拖动事件
 */
function Drag() {
    var drag = d3.drag()
        .on('drag', function () {
            var _this = d3.select(this);
            var transform = _this.attr('transform')
                .replace('translate(', '')
                .replace(')', '');

            var dx = d3.event.dx;
            var dy = d3.event.dy;

            if (transform.indexOf(',') > -1) {
                var xy = transform.split(',');
                dx += parseFloat(xy[0].trim());
                dy += parseFloat(xy[1].trim());
            }

            _this.attr('transform', `translate(${dx},${dy})`);
        });

    return drag;
}

export default Drag;