/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
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