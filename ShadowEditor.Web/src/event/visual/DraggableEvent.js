import BaseEvent from '../BaseEvent';

/**
 * 拖动事件
 * @author tengge / https://github.com/tengge1
 * @param {*} app 
 */
function DraggableEvent(app) {
    BaseEvent.call(this, app);
}

DraggableEvent.prototype = Object.create(BaseEvent.prototype);
DraggableEvent.prototype.constructor = DraggableEvent;

DraggableEvent.prototype.start = function () {
    var _this = null;

    var drag = d3.drag()
        .on('start', function () {
            var target = d3.event.sourceEvent.target;

            var id = d3.select(target).attr('data-id');

            if (!id) {
                return;
            }

            _this = d3.select(`#${id}`);

            if (_this.size() === 0) {
                _this = null;
                console.warn(`DraggableEvent: ${id} is not defined.`);
                return;
            }
        })
        .on('drag', function () {
            if (!_this) {
                return;
            }

            var draggable = _this.classed('Draggable');

            if (!draggable) {
                return;
            }

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
        })
        .on('end', function () {
            _this = null;
        });

    d3.select(this.app.editor.svg)
        .call(drag);
};

DraggableEvent.prototype.stop = function () {

};

export default DraggableEvent;