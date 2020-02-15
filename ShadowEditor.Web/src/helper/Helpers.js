import BaseHelper from './BaseHelper';

import GridHelper from './GridHelper';
import CameraHelper from './CameraHelper';
import PointLightHelpers from './light/PointLightHelpers';
import DirectionalLightHelpers from './light/DirectionalLightHelpers';
import HemisphereLightHelpers from './light/HemisphereLightHelpers';
import RectAreaLightHelpers from './light/RectAreaLightHelpers';
import SpotLightHelpers from './light/SpotLightHelpers';

import ViewHelper from './ViewHelper';
import SelectHelper from './SelectHelper';
import HoverHelper from './HoverHelper';
import SplineHelper from './line/SplineHelper';

// 测试
// import GodRaysHelpers from './light/GodRaysHelpers';

/**
 * 所有帮助器
 * @author tengge / https://github.com/tengge1
 */
function Helpers() {
    BaseHelper.call(this);

    this.helpers = [
        new GridHelper(),
        new CameraHelper(),
        new PointLightHelpers(),
        new DirectionalLightHelpers(),
        new HemisphereLightHelpers(),
        new RectAreaLightHelpers(),
        new SpotLightHelpers(),

        new SelectHelper(),
        new HoverHelper(),
        new ViewHelper(),
        new SplineHelper()

        // 测试
        // new GodRaysHelpers() // 对性能影响太大，请勿使用
    ];
}

Helpers.prototype = Object.create(BaseHelper.prototype);
Helpers.prototype.constructor = Helpers;

Helpers.prototype.start = function () {
    this.helpers.forEach(n => {
        n.start();
    });
};

Helpers.prototype.stop = function () {
    this.helpers.forEach(n => {
        n.stop();
    });
};

export default Helpers;