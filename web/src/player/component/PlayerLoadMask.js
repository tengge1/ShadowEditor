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
import {LoadMask} from '../../ui/index';

/**
 * 播放器下载资源显示蒙版
 * @param {*} app 播放器
 */
class PlayerLoadMask extends PlayerComponent {
    constructor(app) {
        super(app);
        this.container = null;
        this.status = null;
    }

    show() {
        if (!this.container) {
            // load mask
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

            // load status
            this.status = document.createElement('div');
            Object.assign(this.status.style, {
                position: 'absolute',
                left: 0,
                bottom: 0,
                fontSize: '12px',
                color: 'black'
            });
            this.app.container.appendChild(this.status);

            THREE.DefaultLoadingManager.onProgress = url => {
                url = url.replaceAll(this.app.options.server, '');
                this.status.innerHTML = 'Loading ' + url;
            };
        }
        this.container.style.display = 'block';
        this.status.innerHTML = '';
        this.status.style.display = 'inline-block';
    }

    hide() {
        this.container.style.display = 'none';
        this.status.style.display = 'none';
        this.status.innerHTML = '';
    }

    dispose() {

    }
}

export default PlayerLoadMask;