import './css/PropertyPanel.css';
import { classNames, PropTypes, PropertyGrid } from '../../third_party';

import BasicComponent from '../component/BasicComponent.jsx';
import CameraComponent from '../component/CameraComponent.jsx';
import FireComponent from '../component/FireComponent.jsx';
import LightComponent from '../component/LightComponent.jsx';
import LMeshComponent from '../component/LMeshComponent.jsx';

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

            <ReflectorComponent></ReflectorComponent>
            <FireComponent></FireComponent>
            <SmokeComponent></SmokeComponent>
            <LMeshComponent></LMeshComponent>
            <ParticleEmitterComponent></ParticleEmitterComponent>
            <MMDComponent></MMDComponent>

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
        </PropertyGrid>;
    }
}

export default PropertyPanel;