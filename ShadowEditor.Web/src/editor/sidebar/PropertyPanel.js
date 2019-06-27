import UI from '../../ui/UI';
import BasicComponent from '../../component/BasicComponent';
import TransformComponent from '../../component/TransformComponent';
import CameraComponent from '../../component/CameraComponent';
import LightComponent from '../../component/LightComponent';
import ShadowComponent from '../../component/ShadowComponent';
import GeometryComponent from '../../component/GeometryComponent';
import MaterialComponent from '../../component/MaterialComponent';
import PhysicsWorldComponent from '../../component/physics/PhysicsWorldComponent';
import AudioListenerComponent from '../../component/audio/AudioListenerComponent';
import ParticleEmitterComponent from '../../component/ParticleEmitterComponent';
import SceneComponent from '../../component/SceneComponent';
import BackgroundMusicComponent from '../../component/audio/BackgroundMusicComponent';
import FireComponent from '../../component/FireComponent';
import SmokeComponent from '../../component/SmokeComponent';
import ReflectorComponent from '../../component/ReflectorComponent';
import LMeshComponent from '../../component/LMeshComponent';
import MMDComponent from '../../component/MMDComponent';
import RigidBodyComponent from '../../component/physics/RigidBodyComponent';
import SkyComponent from '../../component/object/SkyComponent';
import PerlinTerrainComponent from '../../component/object/PerlinTerrainComponent';
import WaterComponent from '../../component/water/WaterComponent';
import ClothComponent from '../../component/object/ClothComponent';
import ControlComponent from '../../component/control/ControlComponent';
import FirstPersonControlComponent from '../../component/control/FirstPersonControlComponent';
import FlyControlComponent from '../../component/control/FlyControlComponent';
import OrbitControlComponent from '../../component/control/OrbitControlComponent';
import PointerLockControlComponent from '../../component/control/PointerLockControlComponent';
import TrackballControlComponent from '../../component/control/TrackballControlComponent';
import DotScreenComponent from '../../component/postProcessing/DotScreenComponent';
import RgbShiftComponent from '../../component/postProcessing/RgbShiftComponent';
import AfterimageComponent from '../../component/postProcessing/AfterimageComponent';
import BokehComponent from '../../component/postProcessing/BokehComponent';
import FxaaComponent from '../../component/postProcessing/FxaaComponent';
import GlitchComponent from '../../component/postProcessing/GlitchComponent';
import HalftoneComponent from '../../component/postProcessing/HalftoneComponent';
import SsaaComponent from '../../component/postProcessing/SsaaComponent';
import PixelComponent from '../../component/postProcessing/PixelComponent';
import SaoComponent from '../../component/postProcessing/SaoComponent';
import SmaaComponent from '../../component/postProcessing/SmaaComponent';
import SsaoComponent from '../../component/postProcessing/SsaoComponent';
import TaaComponent from '../../component/postProcessing/TaaComponent';
import SoftVolumeComponent from '../../component/physics/SoftVolumeComponent';
import PhysicsTypeComponent from '../../component/physics/PhysicsTypeComponent';

import LineCurveComponent from '../../component/line/LineCurveComponent';
import CatmullRomCurveComponent from '../../component/line/CatmullRomCurveComponent';
import QuadraticBezierCurveComponent from '../../component/line/QuadraticBezierCurveComponent';
import CubicBezierCurveComponent from '../../component/line/CubicBezierCurveComponent';
import EllipseCurveComponent from '../../component/line/EllipseCurveComponent';

import GisBasicComponent from '../../component/gis/GisBasicComponent';

/**
 * 属性面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function PropertyPanel(options) {
    UI.Control.call(this, options);
};

PropertyPanel.prototype = Object.create(UI.Control.prototype);
PropertyPanel.prototype.constructor = PropertyPanel;

PropertyPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        children: [
            new BasicComponent({ app: app }),
            new TransformComponent({ app: app }),
            new SceneComponent({ app: app }),
            new CameraComponent({ app: app }),
            new LightComponent({ app: app }),
            new ShadowComponent({ app: app }),
            new ControlComponent({ app: app }),
            new FirstPersonControlComponent({ app: app }),
            new FlyControlComponent({ app: app }),
            new OrbitControlComponent({ app: app }),
            new PointerLockControlComponent({ app: app }),
            new TrackballControlComponent({ app: app }),
            new ReflectorComponent({ app: app }),
            new PhysicsWorldComponent({ app: app }),

            new GisBasicComponent({ app: app }),

            // 后期处理
            new DotScreenComponent({ app: app }),
            new RgbShiftComponent({ app: app }),
            new AfterimageComponent({ app: app }),
            new BokehComponent({ app: app }),
            new FxaaComponent({ app: app }),
            new GlitchComponent({ app: app }),
            new HalftoneComponent({ app: app }),
            new SsaaComponent({ app: app }),
            new PixelComponent({ app: app }),
            new SaoComponent({ app: app }),
            new SmaaComponent({ app: app }),
            new SsaoComponent({ app: app }),
            new TaaComponent({ app: app }),

            new SkyComponent({ app: app }),
            new PerlinTerrainComponent({ app: app }),
            new AudioListenerComponent({ app: app }),
            new BackgroundMusicComponent({ app: app }),
            new ParticleEmitterComponent({ app: app }),
            new FireComponent({ app: app }),
            new SmokeComponent({ app: app }),
            new WaterComponent({ app: app }),
            new ClothComponent({ app: app }),
            new LMeshComponent({ app: app }),
            new MMDComponent({ app: app }),

            new LineCurveComponent({ app: app }),
            new CatmullRomCurveComponent({ app: app }),
            new QuadraticBezierCurveComponent({ app: app }),
            new CubicBezierCurveComponent({ app: app }),
            new EllipseCurveComponent({ app: app }),

            // 物理组件
            new PhysicsTypeComponent({ app: app }),
            new RigidBodyComponent({ app: app }),
            new SoftVolumeComponent({ app: app }),

            new GeometryComponent({ app: app }),
            new MaterialComponent({ app: app }),
        ]
    };

    var control = UI.create(data);
    control.render();
};

export default PropertyPanel;