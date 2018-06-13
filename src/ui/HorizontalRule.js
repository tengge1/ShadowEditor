import Element from './Element';

// HorizontalRule

function HorizontalRule() {

	Element.call(this);

	var dom = document.createElement('hr');
	dom.className = 'HorizontalRule';

	this.dom = dom;

	return this;

};

HorizontalRule.prototype = Object.create(Element.prototype);
HorizontalRule.prototype.constructor = HorizontalRule;

export default HorizontalRule;