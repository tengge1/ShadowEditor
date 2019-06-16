import './css/Viewport.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Canvas from '../../media/Canvas.jsx';

/**
 * 视口
 * @author tengge / https://github.com/tengge1
 */
class Viewport extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
    }

    componentDidMount() {
        var canvas = this.canvas.current.dom.current;
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(2.4, 2, -1);

        var renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
        });
        renderer.setSize(width, height);

        new THREE.OrbitControls(camera, canvas);

        var amlight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(amlight);

        var dirlight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirlight.position.set(1, 1, 1);
        scene.add(dirlight);
        scene.add(new THREE.DirectionalLightHelper(dirlight));

        scene.add(new THREE.GridHelper());

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        var animate = function () {
            requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        };

        animate();
    }

    render() {
        return <Canvas className={'Viewport'} ref={this.canvas}></Canvas>;
    }
}

export default Viewport;