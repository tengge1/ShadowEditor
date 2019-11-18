

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
    }
};

export default MeshUtils;