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

// ${_t('Listen to click event')}
function onClick(event) {

}

// ${_t('Listen to dblclick event')}
function onDblClick(event) {

}

// ${_t('Listen to keydown event')}
function onKeyDown(event) {

}

// ${_t('Listen to keyup event')}
function onKeyUp(event) {

}

// ${_t('Listen to mousedown event')}
function onMouseDown(event) {

}

// ${_t('Listen to mousemove event')}
function onMouseMove(event) {

}

// ${_t('Listen to mouseup event')}
function onMouseUp(event) {

}

// ${_t('Listen to mousewheel event')}
function onMouseWheel(event) {

}

// ${_t('Listen to resize event')}
function onResize(event) {

}
`;
}

export default JavaScriptStarter;