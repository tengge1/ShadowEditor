/**
 * @author alteredq / http://alteredqualia.com/
 */
THREE.EffectComposer = function (renderer, renderTarget) {

	this.renderer = renderer;

	var size = renderer.getDrawingBufferSize(new THREE.Vector2());

	renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
		stencilBuffer: false
	});

	renderTarget.texture.name = 'EffectComposer.rt1';

	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();
	this.renderTarget2.texture.name = 'EffectComposer.rt2';

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];

	this._previousFrameTime = Date.now();

};

Object.assign(THREE.EffectComposer.prototype, {

	addPass: function (pass) {

		this.passes.push(pass);

		var size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
		pass.setSize(size.width, size.height);

	},

	render: function (deltaTime) {

		if (deltaTime === undefined) {

			deltaTime = (Date.now() - this._previousFrameTime) * 0.001;

		}

		this._previousFrameTime = Date.now();

		var currentRenderTarget = this.renderer.getRenderTarget();

		var pass, i, il = this.passes.length;

		for (i = 0; i < il; i++) {

			pass = this.passes[i];

			pass.render(this.renderer, this.writeBuffer, this.readBuffer, deltaTime);
		}

		this.renderer.setRenderTarget(currentRenderTarget);
	}
});


THREE.Pass = function () {
	// if set to true, the pass is processed by the composer
	this.enabled = true;

	// if set to true, the pass clears its buffer before rendering
	this.clear = false;

	// if set to true, the result of the pass is rendered to screen
	this.renderToScreen = false;
};

Object.assign(THREE.Pass.prototype, {

	setSize: function (width, height) { },

	render: function (renderer, writeBuffer, readBuffer, deltaTime, maskActive) {
		console.error('THREE.Pass: .render() must be implemented in derived pass.');
	}
});
