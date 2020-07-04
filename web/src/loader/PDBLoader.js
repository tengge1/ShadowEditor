/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseLoader from './BaseLoader';

/**
 * PDBLoader
 * @author tengge / https://github.com/tengge1
 */
function PDBLoader() {
    BaseLoader.call(this);
}

PDBLoader.prototype = Object.create(BaseLoader.prototype);
PDBLoader.prototype.constructor = PDBLoader;

PDBLoader.prototype.load = function (url, options) { // eslint-disable-line
    return new Promise(resolve => {
        this.require('PDBLoader').then(() => {
            var loader = new THREE.PDBLoader();

            var offset = new THREE.Vector3();

            loader.load(url, pdb => {
                var geometryAtoms = pdb.geometryAtoms;
                var geometryBonds = pdb.geometryBonds;
                // var json = pdb.json;

                var root = new THREE.Group();

                var boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
                var sphereGeometry = new THREE.IcosahedronBufferGeometry(1, 2);

                geometryAtoms.computeBoundingBox();
                geometryAtoms.boundingBox.getCenter(offset).negate();

                geometryAtoms.translate(offset.x, offset.y, offset.z);
                geometryBonds.translate(offset.x, offset.y, offset.z);

                var positions = geometryAtoms.getAttribute('position');
                var colors = geometryAtoms.getAttribute('color');

                var position = new THREE.Vector3();
                var color = new THREE.Color();

                var i, object;

                for (i = 0; i < positions.count; i++) {
                    position.x = positions.getX(i);
                    position.y = positions.getY(i);
                    position.z = positions.getZ(i);

                    color.r = colors.getX(i);
                    color.g = colors.getY(i);
                    color.b = colors.getZ(i);

                    var material = new THREE.MeshPhongMaterial({ color: color });

                    object = new THREE.Mesh(sphereGeometry, material);
                    object.position.copy(position);
                    object.position.multiplyScalar(75);
                    object.scale.multiplyScalar(25);
                    root.add(object);
                }

                positions = geometryBonds.getAttribute('position');

                var start = new THREE.Vector3();
                var end = new THREE.Vector3();

                for (i = 0; i < positions.count; i += 2) {

                    start.x = positions.getX(i);
                    start.y = positions.getY(i);
                    start.z = positions.getZ(i);

                    end.x = positions.getX(i + 1);
                    end.y = positions.getY(i + 1);
                    end.z = positions.getZ(i + 1);

                    start.multiplyScalar(75);
                    end.multiplyScalar(75);

                    object = new THREE.Mesh(boxGeometry, new THREE.MeshPhongMaterial(0xffffff));
                    object.position.copy(start);
                    object.position.lerp(end, 0.5);
                    object.scale.set(5, 5, start.distanceTo(end));
                    object.lookAt(end);
                    root.add(object);
                }

                resolve(root);
            }, undefined, () => {
                resolve(null);
            });
        });
    });
};

export default PDBLoader;