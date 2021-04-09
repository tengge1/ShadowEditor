/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
/**
 * JavaScript起始代码
 * @returns {String} 代码
 */
function JavaScriptStarter() {
    return `
// ${_t('Execute before scene render')}
function init() {

}

// ${_t('Execute after scene render')}
function start() {

}

// ${_t('Execute each frame during running')}
function update(clock, deltaTime) {

}

// ${_t('Execute after program stopped')}
function stop() {

}

// ${_t('Handle click event')}
function onClick(event) {

}

// ${_t('Handle dblclick event')}
function onDblClick(event) {

}

// ${_t('Handle keydown event')}
function onKeyDown(event) {

}

// ${_t('Handle keyup event')}
function onKeyUp(event) {

}

// ${_t('Handle mousedown event')}
function onMouseDown(event) {

}

// ${_t('Handle mousemove event')}
function onMouseMove(event) {

}

// ${_t('Handle mouseup event')}
function onMouseUp(event) {

}

// ${_t('Handle mousewheel event')}
function onMouseWheel(event) {

}

// ${_t('Handle touchstart event')}
function onTouchStart(event) {

}

// ${_t('Handle touchend event')}
function onTouchEnd(event) {

}

// ${_t('Handle touchmove event')}
function onTouchMove(event) {

}

// ${_t('Handle resize event')}
function onResize(event) {

}

// ${_t('Handle VR connected event')}
function onVRConnected(event) {

}

// ${_t('Handle VR disconnected event')}
function onVRDisconnected(event) {

}

// ${_t('Handle VR selectstart event')}
function onVRSelectStart(event) {

}

// ${_t('Handle VR selectend event')}
function onVRSelectEnd(event) {

}
`;
}

export default JavaScriptStarter;