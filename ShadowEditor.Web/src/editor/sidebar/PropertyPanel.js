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
import ControlComponent from '../../component/ControlComponent';

/**
 * 属性面板
 * @author mrdoob / http://mrdoob.com/
 * @author tengge / https://github.com/tengge1
 */
function PropertyPanel(options) {
    UI.Control.call(this, options);
    this.app = options.app;
};

PropertyPanel.prototype = Object.create(UI.Control.prototype);
PropertyPanel.prototype.constructor = PropertyPanel;

PropertyPanel.prototype.render = function () {
    var data = {
        xtype: 'div',
        parent: this.parent,
        children: [
            new BasicComponent({ app: this.app }),
            new TransformComponent({ app: this.app }),
            new SceneComponent({ app: this.app }),
            new CameraComponent({ app: this.app }),
            new LightComponent({ app: this.app }),
            new ShadowComponent({ app: this.app }),
            new ControlComponent({ app: this.app }),
            new ReflectorComponent({ app: this.app }),
            new SkyComponent({ app: this.app }),
            new PerlinTerrainComponent({ app: this.app }),
            new AudioListenerComponent({ app: this.app }),
            new BackgroundMusicComponent({ app: this.app }),
            new PhysicsWorldComponent({ app: this.app }),
            new ParticleEmitterComponent({ app: this.app }),
            new FireComponent({ app: this.app }),
            new SmokeComponent({ app: this.app }),
            new WaterComponent({ app: this.app }),
            new ClothComponent({ app: this.app }),
            new LMeshComponent({ app: this.app }),
            new MMDComponent({ app: this.app }),
            new RigidBodyComponent({ app: this.app }),
            new GeometryComponent({ app: this.app }),
            new MaterialComponent({ app: this.app })
        ]
    };

    var control = UI.create(data);
    control.render();
};

export default PropertyPanel;