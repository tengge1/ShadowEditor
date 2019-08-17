export { default as i18next } from 'i18next';
export { default as Backend } from 'i18next-xhr-backend';

export { default as classNames } from 'classnames/bind';
export { default as PropTypes } from 'prop-types';
export * from './ui/index';

// TODO: three.js bug THREE.js linearRampToValueAtTime cost too much CPU.
THREE.AudioListener.prototype.updateMatrixWorld = (function () {

    var position = new THREE.Vector3();
    var quaternion = new THREE.Quaternion();
    var scale = new THREE.Vector3();

    var orientation = new THREE.Vector3();
    var clock = new THREE.Clock();

    return function updateMatrixWorld(force) {

        THREE.Object3D.prototype.updateMatrixWorld.call(this, force);

        // var listener = this.context.listener;
        // var up = this.up;

        this.timeDelta = clock.getDelta();

        this.matrixWorld.decompose(position, quaternion, scale);

        // orientation.set( 0, 0, - 1 ).applyQuaternion( quaternion );

        // if ( listener.positionX ) {

        //     // code path for Chrome (see #14393)

        //     var endTime = this.context.currentTime + this.timeDelta;

        //     listener.positionX.linearRampToValueAtTime( position.x, endTime );
        //     listener.positionY.linearRampToValueAtTime( position.y, endTime );
        //     listener.positionZ.linearRampToValueAtTime( position.z, endTime );
        //     listener.forwardX.linearRampToValueAtTime( orientation.x, endTime );
        //     listener.forwardY.linearRampToValueAtTime( orientation.y, endTime );
        //     listener.forwardZ.linearRampToValueAtTime( orientation.z, endTime );
        //     listener.upX.linearRampToValueAtTime( up.x, endTime );
        //     listener.upY.linearRampToValueAtTime( up.y, endTime );
        //     listener.upZ.linearRampToValueAtTime( up.z, endTime );

        // } else {

        //     listener.setPosition( position.x, position.y, position.z );
        //     listener.setOrientation( orientation.x, orientation.y, orientation.z, up.x, up.y, up.z );

        // }

    };

})();