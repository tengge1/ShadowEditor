let ID = -1;

/**
 * 场景模板基类
 */
class BaseSceneTemplate {
    constructor() {
        this.id = `${this.constructor.name}${ID--}`;
    }

    /**
     * 用于子类初始化场景
     */
    create() {

    }
}

export default BaseSceneTemplate;