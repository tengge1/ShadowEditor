/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import PlayerComponent from './PlayerComponent';
import { LoadMask } from '../../ui/index';

/**
 * 播放器下载资源显示蒙版
 * @param {*} app 播放器
 */
function PlayerLoadMask(app) {
    PlayerComponent.call(this, app);
    this.container = null;
}

PlayerLoadMask.prototype = Object.create(PlayerComponent.prototype);
PlayerLoadMask.prototype.constructor = PlayerLoadMask;

PlayerLoadMask.prototype.show = function () {
    if (!this.container) {
        this.container = document.createElement('div');
        Object.assign(this.container.style, {
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            // background: 'rgba(0,0,0,0.2)',
            zIndex: 100
        });
        const loader = React.createElement(LoadMask, {
            text: 'Loading...'
        });
        ReactDOM.render(loader, this.container);
        this.app.container.appendChild(this.container);
    }
    this.container.style.display = 'block';
};

PlayerLoadMask.prototype.hide = function () {
    this.container.style.display = 'none';
};

PlayerLoadMask.prototype.dispose = function () {

};

export default PlayerLoadMask;