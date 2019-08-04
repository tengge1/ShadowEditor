import './css/PropertyPanel.css';
import { classNames, PropTypes, PropertyGrid } from '../../third_party';

import BasicComponent from '../component/BasicComponent.jsx';
import CameraComponent from '../component/CameraComponent.jsx';
import FireComponent from '../component/FireComponent.jsx';
import WaterComponent from '../component/water/WaterComponent.jsx';
import LightComponent from '../component/LightComponent.jsx';
import LMeshComponent from '../component/LMeshComponent.jsx';
import ClothComponent from '../component/object/ClothComponent.jsx';

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

import MaterialComponent from '../component/MaterialComponent.jsx';
import TransformComponent from '../component/TransformComponent.jsx';
import SmokeComponent from '../component/SmokeComponent.jsx';
import ShadowComponent from '../component/ShadowComponent.jsx';
import SceneComponent from '../component/SceneComponent.jsx';
import ReflectorComponent from '../component/ReflectorComponent.jsx';
import ParticleEmitterComponent from '../component/ParticleEmitterComponent.jsx';
import MMDComponent from '../component/MMDComponent.jsx';

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

import BasicAnimationComponent from '../component/animation/BasicAnimationComponent.jsx';
import TweenAnimationComponent from '../component/animation/TweenAnimationComponent.jsx';

import AudioListenerComponent from '../component/audio/AudioListenerComponent.jsx';
import BackgroundMusicComponent from '../component/audio/BackgroundMusicComponent.jsx';

import ControlComponent from '../component/control/ControlComponent.jsx';
import FirstPersonControlComponent from '../component/control/FirstPersonControlComponent.jsx';
import FlyControlComponent from '../component/control/FlyControlComponent.jsx';
import OrbitControlComponent from '../component/control/OrbitControlComponent.jsx';
import PointerLockControlComponent from '../component/control/PointerLockControlComponent.jsx';
import TrackballControlComponent from '../component/control/TrackballControlComponent.jsx';

import GisBasicComponent from '../component/gis/GisBasicComponent.jsx';

import CatmullRomCurveComponent from '../component/line/CatmullRomCurveComponent.jsx';
import CubicBezierCurveComponent from '../component/line/CubicBezierCurveComponent.jsx';
import EllipseCurveComponent from '../component/line/EllipseCurveComponent.jsx';
import LineCurveComponent from '../component/line/LineCurveComponent.jsx';
import QuadraticBezierCurveComponent from '../component/line/QuadraticBezierCurveComponent.jsx';

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
            <BasicComponent></BasicComponent>
            <TransformComponent></TransformComponent>
            <SceneComponent></SceneComponent>
            <LightComponent></LightComponent>
            <ShadowComponent></ShadowComponent>
            <CameraComponent></CameraComponent>
            <AudioListenerComponent></AudioListenerComponent>
            <BackgroundMusicComponent></BackgroundMusicComponent>

            <ReflectorComponent></ReflectorComponent>
            <FireComponent></FireComponent>
            <WaterComponent></WaterComponent>
            <SmokeComponent></SmokeComponent>
            <LMeshComponent></LMeshComponent>
            <ClothComponent></ClothComponent>
            <ParticleEmitterComponent></ParticleEmitterComponent>
            <MMDComponent></MMDComponent>

            <CatmullRomCurveComponent></CatmullRomCurveComponent>
            <CubicBezierCurveComponent></CubicBezierCurveComponent>
            <EllipseCurveComponent></EllipseCurveComponent>
            <LineCurveComponent></LineCurveComponent>
            <QuadraticBezierCurveComponent></QuadraticBezierCurveComponent>

            <GisBasicComponent></GisBasicComponent>

            <ControlComponent></ControlComponent>
            <FirstPersonControlComponent></FirstPersonControlComponent>
            <FlyControlComponent></FlyControlComponent>
            <OrbitControlComponent></OrbitControlComponent>
            <PointerLockControlComponent></PointerLockControlComponent>
            <TrackballControlComponent></TrackballControlComponent>

            <BoxGeometryComponent></BoxGeometryComponent>
            <CircleGeometryComponent></CircleGeometryComponent>
            <CylinderGeometryComponent></CylinderGeometryComponent>
            <IcosahedronGeometryComponent></IcosahedronGeometryComponent>
            <LatheGeometryComponent></LatheGeometryComponent>
            <PlaneGeometryComponent></PlaneGeometryComponent>
            <SphereGeometryComponent></SphereGeometryComponent>
            <TeapotGeometryComponent></TeapotGeometryComponent>
            <TorusGeometryComponent></TorusGeometryComponent>
            <TorusKnotGeometryComponent></TorusKnotGeometryComponent>

            <MaterialComponent></MaterialComponent>

            <AfterimageComponent></AfterimageComponent>
            <BokehComponent></BokehComponent>
            <DotScreenComponent></DotScreenComponent>
            <FxaaComponent></FxaaComponent>
            <GlitchComponent></GlitchComponent>
            <HalftoneComponent></HalftoneComponent>
            <PixelComponent></PixelComponent>
            <RgbShiftComponent></RgbShiftComponent>
            <SaoComponent></SaoComponent>
            <SmaaComponent></SmaaComponent>
            <SsaaComponent></SsaaComponent>
            <SsaoComponent></SsaoComponent>
            <TaaComponent></TaaComponent>

            <BasicAnimationComponent></BasicAnimationComponent>
            <TweenAnimationComponent></TweenAnimationComponent>
        </PropertyGrid>;
    }
}

export default PropertyPanel;