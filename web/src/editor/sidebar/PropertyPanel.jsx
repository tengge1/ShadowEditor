/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/PropertyPanel.css';
import { PropertyGrid } from '../../ui/index';

// component
import BasicComponent from '../component/BasicComponent.jsx';
import CameraComponent from '../component/CameraComponent.jsx';
import FireComponent from '../component/FireComponent.jsx';
import LightComponent from '../component/LightComponent.jsx';
import LMeshComponent from '../component/LMeshComponent.jsx';
import MultiMaterialComponent from '../component/MultiMaterialComponent.jsx';
import MaterialComponent from '../component/MaterialComponent.jsx';
import MMDComponent from '../component/MMDComponent.jsx';
import ParticleEmitterComponent from '../component/ParticleEmitterComponent.jsx';
import ReflectorComponent from '../component/ReflectorComponent.jsx';
import SceneComponent from '../component/SceneComponent.jsx';
import ShadowComponent from '../component/ShadowComponent.jsx';
import SmokeComponent from '../component/SmokeComponent.jsx';
import TransformComponent from '../component/TransformComponent.jsx';
// import ScriptComponent from '../component/ScriptComponent.jsx';

// component/audio
import AudioListenerComponent from '../component/audio/AudioListenerComponent.jsx';
import BackgroundMusicComponent from '../component/audio/BackgroundMusicComponent.jsx';

// component/control
import ControlComponent from '../component/control/ControlComponent.jsx';
import FirstPersonControlComponent from '../component/control/FirstPersonControlComponent.jsx';
import FlyControlComponent from '../component/control/FlyControlComponent.jsx';
import OrbitControlComponent from '../component/control/OrbitControlComponent.jsx';
import PointerLockControlComponent from '../component/control/PointerLockControlComponent.jsx';
import TrackballControlComponent from '../component/control/TrackballControlComponent.jsx';

// component/geometry
import BufferGeometryComponent from '../component/geometry/BufferGeometryComponent.jsx';
import BoxGeometryComponent from '../component/geometry/BoxGeometryComponent.jsx';
import CircleGeometryComponent from '../component/geometry/CircleGeometryComponent.jsx';
import CylinderGeometryComponent from '../component/geometry/CylinderGeometryComponent.jsx';
import IcosahedronGeometryComponent from '../component/geometry/IcosahedronGeometryComponent.jsx';
import LatheGeometryComponent from '../component/geometry/LatheGeometryComponent.jsx';
import PlaneGeometryComponent from '../component/geometry/PlaneGeometryComponent.jsx';
import SphereGeometryComponent from '../component/geometry/SphereGeometryComponent.jsx';
import TeapotGeometryComponent from '../component/geometry/TeapotGeometryComponent.jsx';
import TorusGeometryComponent from '../component/geometry/TorusGeometryComponent.jsx';
import TorusKnotGeometryComponent from '../component/geometry/TorusKnotGeometryComponent.jsx';

// component/gis
import GisBasicComponent from '../component/gis/GisBasicComponent.jsx';

// component/line
import CatmullRomCurveComponent from '../component/line/CatmullRomCurveComponent.jsx';
import CubicBezierCurveComponent from '../component/line/CubicBezierCurveComponent.jsx';
import EllipseCurveComponent from '../component/line/EllipseCurveComponent.jsx';
import LineCurveComponent from '../component/line/LineCurveComponent.jsx';
import QuadraticBezierCurveComponent from '../component/line/QuadraticBezierCurveComponent.jsx';

// component/object
import ClothComponent from '../component/object/ClothComponent.jsx';
import PerlinTerrainComponent from '../component/object/PerlinTerrainComponent.jsx';
import SkyComponent from '../component/object/SkyComponent.jsx';
import WaterComponent from '../component/object/WaterComponent.jsx';

// component/physics
import PhysicsTypeComponent from '../component/physics/PhysicsTypeComponent.jsx';
import PhysicsWorldComponent from '../component/physics/PhysicsWorldComponent.jsx';
import RigidBodyComponent from '../component/physics/RigidBodyComponent.jsx';
import SoftVolumeComponent from '../component/physics/SoftVolumeComponent.jsx';

// component/postProcessing
import AfterimageComponent from '../component/postProcessing/AfterimageComponent.jsx';
import BokehComponent from '../component/postProcessing/BokehComponent.jsx';
import DotScreenComponent from '../component/postProcessing/DotScreenComponent.jsx';
import FxaaComponent from '../component/postProcessing/FxaaComponent.jsx';
import GlitchComponent from '../component/postProcessing/GlitchComponent.jsx';
import HalftoneComponent from '../component/postProcessing/HalftoneComponent.jsx';
import PixelComponent from '../component/postProcessing/PixelComponent.jsx';
import RgbShiftComponent from '../component/postProcessing/RgbShiftComponent.jsx';
import SaoComponent from '../component/postProcessing/SaoComponent.jsx';
import SmaaComponent from '../component/postProcessing/SmaaComponent.jsx';
import SsaaComponent from '../component/postProcessing/SsaaComponent.jsx';
import SsaoComponent from '../component/postProcessing/SsaoComponent.jsx';
import TaaComponent from '../component/postProcessing/TaaComponent.jsx';

/**
 * 属性面板
 * @author tengge / https://github.com/tengge1
 */
class PropertyPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <PropertyGrid>
            {/* component */}
            <BasicComponent />
            <TransformComponent />
            <SceneComponent />
            <LightComponent />
            <ShadowComponent />
            <CameraComponent />
            <AudioListenerComponent />
            {/* <ScriptComponent /> */}

            {/* component/objects */}
            <BackgroundMusicComponent />
            <ReflectorComponent />
            <FireComponent />
            <WaterComponent />
            <SmokeComponent />
            <LMeshComponent />
            <ClothComponent />
            <PerlinTerrainComponent />
            <SkyComponent />
            <ParticleEmitterComponent />
            <MMDComponent />

            {/* component/gis */}
            <GisBasicComponent />

            {/* component/line */}
            <CatmullRomCurveComponent />
            <CubicBezierCurveComponent />
            <EllipseCurveComponent />
            <LineCurveComponent />
            <QuadraticBezierCurveComponent />

            {/* component/control */}
            <ControlComponent />
            <FirstPersonControlComponent />
            <FlyControlComponent />
            <OrbitControlComponent />
            <PointerLockControlComponent />
            <TrackballControlComponent />

            {/* component/physics */}
            <PhysicsTypeComponent />
            <PhysicsWorldComponent />
            <RigidBodyComponent />
            <SoftVolumeComponent />

            {/* component/geometry */}
            <BufferGeometryComponent />
            <BoxGeometryComponent />
            <CircleGeometryComponent />
            <CylinderGeometryComponent />
            <IcosahedronGeometryComponent />
            <LatheGeometryComponent />
            <PlaneGeometryComponent />
            <SphereGeometryComponent />
            <TeapotGeometryComponent />
            <TorusGeometryComponent />
            <TorusKnotGeometryComponent />

            {/* component/material */}
            <MultiMaterialComponent />
            <MaterialComponent />

            {/* component/postProcessing */}
            <AfterimageComponent />
            <BokehComponent />
            <DotScreenComponent />
            <FxaaComponent />
            <GlitchComponent />
            <HalftoneComponent />
            <PixelComponent />
            <RgbShiftComponent />
            <SaoComponent />
            <SmaaComponent />
            <SsaaComponent />
            <SsaoComponent />
            <TaaComponent />
        </PropertyGrid>;
    }
}

export default PropertyPanel;