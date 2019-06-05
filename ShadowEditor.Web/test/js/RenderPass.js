/**
 * @author alteredq / http://alteredqualia.com/
 */
THREE.RenderPass = function (scene, camera) {

	THREE.Pass.call(this);

	this.scene = scene;
	this.camera = camera;

};

THREE.RenderPass.prototype = Object.assign(Object.create(THREE.Pass.prototype), {

	constructor: THREE.RenderPass,

	render: function (renderer, writeBuffer, readBuffer) {

		renderer.setRenderTarget(readBuffer);

		renderer.clear();

		renderer.render(this.scene, this.camera);

	}
});
