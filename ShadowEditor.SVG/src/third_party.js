import { Control } from '@tengge1/xtype.js';

const xlinkns = "http://www.w3.org/1999/xlink";

/**
* 渲染dom
* @param {*} dom 
*/
Control.prototype.renderDom = function (dom) {
    this.dom = dom;
    this.parent.appendChild(this.dom);

    if (this.attr) {
        Object.keys(this.attr).forEach(n => {
            // 对于类似`xlink:href`的属性，需要使用setAttributeNS设置属性，否则svg显示不出来
            if (n.startsWith('xlink')) {
                this.dom.setAttributeNS(xlinkns, n, this.attr[n]);
            } else {
                this.dom.setAttribute(n, this.attr[n]);
            }
        });
    }

    if (this.cls) {
        this.dom.className = this.cls;
    }

    if (this.data) {
        Object.assign(this.dom, this.data);
    }

    if (this.style) {
        Object.assign(this.dom.style, this.style);
    }

    if (this.listeners) {
        Object.keys(this.listeners).forEach(n => {
            this.dom['on' + n] = this.listeners[n];
        });
    }

    if (this.userData) {
        this.dom.userData = {};
        Object.assign(this.dom.userData, this.userData);
    }

    if (this.html) {
        this.dom.innerHTML = this.html;
    }

    this.children.forEach(n => {
        var control = window.UI.create(n);
        control.parent = this.dom;
        control.render();
    });
};

export { Control, UI } from '@tengge1/xtype.js';