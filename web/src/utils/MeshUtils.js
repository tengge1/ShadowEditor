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
 * 模型工具类
 */
const MeshUtils = {
    /**
     * 遍历模型子元素，得到uuid列表
     * @param {THREE.Object3D} children 模型的children数组
     * @param {Array} list uuid数组
     */
    traverseUUID(children, list) {
        for (let i = 0; i < children.length; i++) {
            let child = children[i];

            let list1 = [];

            if (child.children && child.children.length > 0) {
                this.traverseUUID(child.children, list1);
            }

            list.push({
                uuid: child.uuid,
                children: list1
            });
        }
    },
    /**
     * 通过模型组件获取整个模型
     * @param {*} obj 通过模型的一部分获取整个模型
     * @returns {*} 整体模型
     */
    partToMesh(obj) {
        let scene = app.editor.scene;

        if (obj === scene || obj.userData && obj.userData.Server === true) { // 场景或服务端模型
            return obj;
        }

        // 判断obj是否是模型的一部分
        let model = obj;
        let isPart = false;

        while (model) {
            if (model === scene) {
                break;
            }
            if (model.userData && model.userData.Server === true) {
                isPart = true;
                break;
            }

            model = model.parent;
        }

        if (isPart) {
            return model;
        }

        return obj;
    }
};

export default MeshUtils;