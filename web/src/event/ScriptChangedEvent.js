/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import BaseEvent from './BaseEvent';
import global from '../global';

/**
 * 脚本改变事件
 * @author tengge / https://github.com/tengge1
 */
class ScriptChangedEvent extends BaseEvent {
    constructor() {
        super();
        this.handleChange = this.handleChange.bind(this);
    }

    start() {
        global.app.on(`scriptChanged.${this.id}`, this.handleChange);
    }

    stop() {
        global.app.on(`scriptChanged.${this.id}`, null);
    }

    handleChange() {
        global.app.call('send', this, {
            type: 'changeScript',
            scripts: global.app.editor.scripts
        });
    }
}

export default ScriptChangedEvent;