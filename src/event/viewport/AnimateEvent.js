import BaseEvent from '../BaseEvent';

/**
 * 动画事件
 * @param {*} app 
 */
function AnimateEvent(app) {
    BaseEvent.call(this, app);
}

AnimateEvent.prototype = Object.create(BaseEvent.prototype);
AnimateEvent.prototype.constructor = AnimateEvent;

AnimateEvent.prototype.start = function () {
    var _this = this;
    this.app.on('animate.' + this.id, function () {
        _this.onAnimate();
    });
};

AnimateEvent.prototype.stop = function () {
    this.app.on('animate.' + this.id, null);
};

AnimateEvent.prototype.onAnimate = function () {
    var vrEffect = this.app.editor.vrEffect;

    var _this = this;
    requestAnimationFrame(function () {
        _this.onAnimate();
    });

    /*

    // animations

    if ( THREE.AnimationHandler.animations.length > 0 ) {

        THREE.AnimationHandler.update( 0.016 );

        for ( var i = 0, l = sceneHelpers.children.length; i < l; i ++ ) {

            var helper = sceneHelpers.children[ i ];

            if ( helper instanceof THREE.SkeletonHelper ) {

                helper.update();

            }

        }

    }
    */

    if (vrEffect && vrEffect.isPresenting) {
        _this.app.call('render');
    }
};

export default AnimateEvent;