import Control from '../ui/Control';

/**
 * 时间线窗口
 * @param {*} options 
 */
function TimePanel(options) {
    Control.call(this, options);
}

TimePanel.prototype = Object.create(Control.prototype);
TimePanel.prototype.constructor = TimePanel;

TimePanel.prototype.render = function () {
    return;
    var target = {
        x: 0,
        y: 0,
        rotate: 0
    };

    var timeliner = new Timeliner(target, {
        position: 'absolute',
        left: '48px',
        right: '300px',
        bottom: '32px'
    });

    timeliner.load({
        'version': '1.2.0',
        'modified': 'Mon Dec 08 2014 10:41:11 GMT+0800 (SGT)',
        'title': 'Untitled',
        'layers': [{
            'name': 'x',
            'values': [{
                'time': 0.1,
                'value': 0,
                '_color': '#893c0f',
                'tween': 'quadEaseIn'
            }, {
                'time': 3,
                'value': 3.500023,
                '_color': '#b074a0'
            }],
            'tmpValue': 3.500023,
            '_color': '#6ee167'
        }, {
            'name': 'y',
            'values': [{
                'time': 0.1,
                'value': 0,
                '_color':
                    '#abac31',
                'tween': 'quadEaseOut'
            }, {
                'time': 0.5,
                'value': -1.000001,
                '_color': '#355ce8',
                'tween': 'quadEaseIn'
            }, {
                'time': 1.1,
                'value': 0,
                '_color': '#47e90',
                'tween': 'quadEaseOut'
            }, {
                'time': 1.7,
                'value': -0.5,
                '_color':
                    '#f76bca',
                'tween': 'quadEaseOut'
            }, {
                'time': 2.3,
                'value': 0,
                '_color': '#d59cfd'
            }],
            'tmpValue': -0.5,
            '_color': '#8bd589'
        }, {
            'name': 'rotate',
            'values': [{
                'time': 0.1,
                'value': -25.700014000000003,
                '_color': '#f50ae9',
                'tween': 'quadEaseInOut'
            }, {
                'time': 2.8,
                'value': 0,
                '_color': '#2e3712'
            }],
            'tmpValue': -25.700014000000003,
            '_color': '#2d9f57'
        }]
    });
};

export default TimePanel;