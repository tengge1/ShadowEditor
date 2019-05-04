(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Shadow = {})));
}(this, (function (exports) { 'use strict';

	class Alert extends React.Component {
	  render() {
	    const {
	      title,
	      children
	    } = this.props;
	    return React.createElement("div", {
	      className: "Alert"
	    }, React.createElement("div", {
	      className: "wrap"
	    }, React.createElement("div", {
	      className: "title"
	    }, React.createElement("span", null, title || 'Message'), React.createElement("div", {
	      className: "controls"
	    }, React.createElement("i", {
	      className: "iconfont icon-close icon"
	    }))), React.createElement("div", {
	      className: "content"
	    }, React.createElement("p", null, children)), React.createElement("div", {
	      className: "buttons"
	    }, React.createElement("div", {
	      className: "button-wrap"
	    }, React.createElement("button", {
	      className: "button"
	    }, "OK")))), React.createElement("div", {
	      className: "resize"
	    }));
	  }

	}

	class Button extends React.Component {
	  render() {
	    const {
	      children
	    } = this.props;
	    return React.createElement("button", {
	      className: "Button"
	    }, children);
	  }

	}

	exports.Alert = Alert;
	exports.Button = Button;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
