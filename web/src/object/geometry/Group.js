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
 * 组
 */
function Group() {
    THREE.Group.call(this);
    this.name = _t('Group');
}

Group.prototype = Object.create(THREE.Group.prototype);
Group.prototype.constructor = Group;

export default Group;