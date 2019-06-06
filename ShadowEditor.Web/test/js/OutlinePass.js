/**
 * @author spidersharma / http://eduperiment.com/
 */
THREE.OutlinePass = function (resolution, scene, camera, selectedObjects) {

	this.renderScene = scene;
	this.renderCamera = camera;
	this.selectedObjects = selectedObjects;

	this.downSampleRatio = 1;

	THREE.Pass.call(this);

	this.resolution = new THREE.Vector2(resolution.x, resolution.y);

	var pars = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat
	};

	this.resx = Math.round(this.resolution.x / this.downSampleRatio);
	this.resy = Math.round(this.resolution.y / this.downSampleRatio);

	this.renderTargetMaskBuffer = new THREE.WebGLRenderTarget(this.resolution.x, this.resolution.y, pars);
	this.renderTargetMaskBuffer.texture.generateMipmaps = false;

	this.edgeDetectionMaterial = this.getEdgeDetectionMaterial();

	this.renderTargetEdgeBuffer1 = new THREE.WebGLRenderTarget(this.resx, this.resy, pars);
	this.renderTargetEdgeBuffer1.texture.generateMipmaps = false;

	var copyShader = THREE.CopyShader;

	this.copyUniforms = THREE.UniformsUtils.clone(copyShader.uniforms);
	this.copyUniforms["opacity"].value = 1.0;

	this.materialCopy = new THREE.ShaderMaterial({
		uniforms: this.copyUniforms,
		vertexShader: copyShader.vertexShader,
		fragmentShader: copyShader.fragmentShader,
		blending: THREE.NoBlending,
		depthTest: false,
		depthWrite: false,
		transparent: true
	});

	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;

	this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	this.scene = new THREE.Scene();

	this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
	this.quad.frustumCulled = false;
	this.scene.add(this.quad);
};

THREE.OutlinePass.prototype = Object.assign(Object.create(THREE.Pass.prototype), {

	constructor: THREE.OutlinePass,

	render: function (renderer, writeBuffer, readBuffer, deltaTime) {

		this.oldClearColor.copy(renderer.getClearColor());
		this.oldClearAlpha = renderer.getClearAlpha();
		var oldAutoClear = renderer.autoClear;

		renderer.autoClear = false;

		renderer.setClearColor(0xffffff, 1);

		renderer.setRenderTarget(this.renderTargetMaskBuffer);
		renderer.clear();
		renderer.render(this.renderScene, this.renderCamera);

		// 3. Apply Edge Detection Pass
		this.quad.material = this.edgeDetectionMaterial;
		this.edgeDetectionMaterial.uniforms["maskTexture"].value = this.renderTargetMaskBuffer.texture;
		this.edgeDetectionMaterial.uniforms["texSize"].value.set(this.resx, this.resy);
		renderer.setRenderTarget(this.renderTargetEdgeBuffer1);
		renderer.clear();
		renderer.render(this.scene, this.camera);

		renderer.setClearColor(this.oldClearColor, this.oldClearAlpha);
		renderer.autoClear = oldAutoClear;

		this.quad.material = this.materialCopy;
		this.copyUniforms["tDiffuse"].value = this.renderTargetEdgeBuffer1.texture;
		renderer.setRenderTarget(null);
		renderer.render(this.scene, this.camera);
	},

	getEdgeDetectionMaterial: function () {
		return new THREE.ShaderMaterial({
			uniforms: {
				"maskTexture": {
					value: null
				},
				"texSize": {
					value: new THREE.Vector2(0.5, 0.5)
				},
				"visibleEdgeColor": {
					value: new THREE.Vector3(1.0, 1.0, 1.0)
				},
				"hiddenEdgeColor": {
					value: new THREE.Vector3(1.0, 1.0, 1.0)
				},
			},

			vertexShader: "varying vec2 vUv;\n\
				void main() {\n\
					vUv = uv;\n\
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
				}",

			fragmentShader: "varying vec2 vUv;\
				uniform sampler2D maskTexture;\
				uniform vec2 texSize;\
				uniform vec3 visibleEdgeColor;\
				uniform vec3 hiddenEdgeColor;\
				\
				void main() {\n\
					vec2 invSize = 1.0 / texSize;\
					vec4 uvOffset = vec4(1.0, 0.0, 0.0, 1.0) * vec4(invSize, invSize);\
					vec4 c1 = texture2D( maskTexture, vUv + uvOffset.xy);\
					vec4 c2 = texture2D( maskTexture, vUv - uvOffset.xy);\
					vec4 c3 = texture2D( maskTexture, vUv + uvOffset.yw);\
					vec4 c4 = texture2D( maskTexture, vUv - uvOffset.yw);\
					float diff1 = (c1.r - c2.r)*0.5;\
					float diff2 = (c3.r - c4.r)*0.5;\
					float d = length( vec2(diff1, diff2) );\
					float a1 = min(c1.g, c2.g);\
					float a2 = min(c3.g, c4.g);\
					float visibilityFactor = min(a1, a2);\
					vec3 edgeColor = 1.0 - visibilityFactor > 0.001 ? visibleEdgeColor : hiddenEdgeColor;\
					gl_FragColor = vec4(edgeColor, 1.0) * vec4(d);\
				}"
		});
	}
});
