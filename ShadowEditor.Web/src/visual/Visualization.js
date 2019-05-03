import BaseComponent from './BaseComponent';
import Button from './component/Button';
import Label from './component/Label';
import Panel from './component/Panel';
import HorizontalLine from './component/HorizontalLine';
import BarChart from './component/BarChart';
import TimeLabel from './component/TimeLabel';
import VerticalLine from './component/VerticalLine';
import DateWeekLabel from './component/DateWeekLabel';
import TimeDisk from './component/TimeDisk';
import KeyValueLabel from './component/KeyValueLabel';
import FormPanel from './component/FormPanel';
import Gauge from './component/Gauge';
import Histogram from './component/Histogram';
import LineChart from './component/LineChart';

const ComponentTypes = {
    Button,
    Label,
    Panel,
    HorizontalLine,
    BarChart,
    TimeLabel,
    DateWeekLabel,
    TimeDisk,
    KeyValueLabel,
    FormPanel,
    Gauge,
    Histogram,
    LineChart,
};

/**
 * 数据可视化
 * @author tengge / https://github.com/tengge1
 */
function Visualization() {
    BaseComponent.call(this);
    this.components = [];
}

Visualization.prototype = Object.create(BaseComponent.prototype);
Visualization.prototype.constructor = Visualization;

/**
 * 添加一个组件
 * @param {BaseComponent} component 可视化组件
 */
Visualization.prototype.add = function (component) {
    if (!(component instanceof BaseComponent)) {
        console.warn(`Visualization: component is not an instance of BaseComponent.`);
        return;
    }
    if (this.components.indexOf(component) > -1) {
        console.warn(`Visualization: component has already added to the list.`);
        return;
    }

    this.components.push(component);
};

/**
 * 移除一个组件
 * @param {BaseComponent} component 可视化组件
 */
Visualization.prototype.remove = function (component) {
    if (!(component instanceof BaseComponent)) {
        console.warn(`Visualization: component is not an instance of BaseComponent.`);
        return;
    }

    var index = this.components.indexOf(component);

    if (index === -1) {
        console.warn(`Visualization: component does not exist in the list.`);
        return;
    }

    this.components.splice(index, 1);
};

Visualization.prototype.get = function (id) {
    var component = this.components.filter(n => {
        return n.id === id;
    })[0];

    if (!component) {
        console.warn(`Visualization: component#${id} is not defined.`);
        return null;
    }

    return component;
};

/**
 * 将所有控件渲染到svgDom里面
 * @param {SVGSVGElement} svgDom SVG元素
 */
Visualization.prototype.render = function (svgDom) {
    if (!(svgDom instanceof SVGSVGElement)) {
        console.warn(`Visualization: svgDom is not an instance of SVGSVGElement.`);
        return;
    }

    this.components.forEach(n => {
        n.render(svgDom);
    });
};

/**
 * svg控件转json
 */
Visualization.prototype.toJSON = function () {
    var list = [];

    this.components.forEach(n => {
        var jsons = n.toJSON();

        if (Array.isArray(jsons)) {
            list.push.apply(list, jsons);
        } else if (jsons) {
            list.push(jsons);
        } else {
            console.warn(`Visualization: ${n.id}.toJSON() result in null.`);
        }
    });

    return list;
};

/**
 * json转svg控件
 * @param {Object} jsons JSON字符串序列后的对象
 */
Visualization.prototype.fromJSON = function (jsons) {
    if (!Array.isArray(jsons)) {
        console.warn(`Visualization: jsons is not an Array.`);
        return;
    }

    this.clear();

    jsons.forEach(n => {
        var ctype = ComponentTypes[n.type];
        if (ctype) {
            var component = new ctype();
            component.fromJSON(n);
            this.add(component);
        } else {
            console.warn(`Visualization: there is no ComponentType named ${n.type}.`);
        }
    });
};

/**
 * 清空组件
 */
Visualization.prototype.clear = function () {
    this.components.forEach(n => {
        n.clear();
    });
    this.components.length = 0;
};

export default Visualization;