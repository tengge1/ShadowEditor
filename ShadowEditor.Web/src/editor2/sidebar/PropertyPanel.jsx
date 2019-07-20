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
            <ShadowComponent></ShadowComponent>

            <CameraComponent></CameraComponent>
            <FireComponent></FireComponent>
            <LightComponent></LightComponent>
            <LMeshComponent></LMeshComponent>

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

            <SmokeComponent></SmokeComponent>
        </PropertyGrid>;
    }
}

export default PropertyPanel;