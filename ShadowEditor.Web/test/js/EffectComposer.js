/**
 * @author alteredq / http://alteredqualia.com/
 */
THREE.EffectComposer = function (renderer) {
	this.renderer = renderer;

	var size = renderer.getDrawingBufferSize(new THREE.Vector2());

	var renderTarget = new THREE.WebGLRenderTarget(size.width, size.height, {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
		stencilBuffer: false
	});

	this.writeBuffer = renderTarget;
	this.readBuffer = renderTarget.clone();

	this.passes = [];
};

Object.assign(THREE.EffectComposer.prototype, {

	addPass: function (pass) {
		this.passes.push(pass);
	},

	render: function () {
		var pass, i, il = this.passes.length;

		for (i = 0; i < il; i++) {
			pass = this.passes[i];
			pass.render(this.renderer, this.writeBuffer, this.readBuffer);
		}
	}
});


THREE.Pass = function () { };

Object.assign(THREE.Pass.prototype, {
	render: function (renderer, writeBuffer, readBuffer) {

	}
});
