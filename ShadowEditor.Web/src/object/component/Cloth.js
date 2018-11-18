function Cloth() {
    var pinsFormation = [];
    var pins = [6];

    pinsFormation.push(pins);

    pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    pinsFormation.push(pins);

    pins = [0];
    pinsFormation.push(pins);

    pins = []; // cut the rope ;)
    pinsFormation.push(pins);

    pins = [0, cloth.w]; // classic 2 pins
    pinsFormation.push(pins);

    pins = pinsFormation[1];

    function togglePins() {
        pins = pinsFormation[~~(Math.random() * pinsFormation.length)];
    }

    if (!Detector.webgl) Detector.addGetWebGLMessage();

    var container, stats;
    var camera, scene, renderer;

    var clothGeometry;
    var sphere;
    var object;

    init();
    animate();

    function init() {

        var loader = new THREE.TextureLoader();
        var clothTexture = loader.load('textures/patterns/circuit_pattern.png');
        clothTexture.anisotropy = 16;

        var clothMaterial = new THREE.MeshLambertMaterial({
            map: clothTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
        });

        // cloth geometry

        clothGeometry = new THREE.ParametricGeometry(clothFunction, cloth.w, cloth.h);

        // cloth mesh

        object = new THREE.Mesh(clothGeometry, clothMaterial);
        object.position.set(0, 0, 0);
        object.castShadow = true;
        scene.add(object);

        object.customDepthMaterial = new THREE.MeshDepthMaterial({

            depthPacking: THREE.RGBADepthPacking,
            map: clothTexture,
            alphaTest: 0.5

        });

        // 
    }

    //

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    //

    function animate() {

        requestAnimationFrame(animate);

        var time = Date.now();

        var windStrength = Math.cos(time / 7000) * 20 + 40;

        windForce.set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000))
        windForce.normalize()
        windForce.multiplyScalar(windStrength);

        simulate(time);
        render();
        stats.update();

    }

    function render() {

        var p = cloth.particles;

        for (var i = 0, il = p.length; i < il; i++) {

            clothGeometry.vertices[i].copy(p[i].position);

        }

        clothGeometry.verticesNeedUpdate = true;

        clothGeometry.computeFaceNormals();
        clothGeometry.computeVertexNormals();

        sphere.position.copy(ballPosition);

        renderer.render(scene, camera);
    }
}
