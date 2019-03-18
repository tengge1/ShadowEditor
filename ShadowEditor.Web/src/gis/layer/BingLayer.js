import Layer from './Layer';

function BingLayer() {
    Layer.call(this);
}

BingLayer.prototype = Object.create(Layer.prototype);
BingLayer.prototype.constructor = BingLayer;

export default BingLayer;