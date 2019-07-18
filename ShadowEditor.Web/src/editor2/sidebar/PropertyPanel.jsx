import './css/PropertyPanel.css';
import { classNames, PropTypes, PropertyGrid } from '../../third_party';

import BasicComponent from '../component/BasicComponent.jsx';
import CameraComponent from '../component/CameraComponent.jsx';
import FireComponent from '../component/FireComponent.jsx';
import LightComponent from '../component/LightComponent.jsx';
import LMeshComponent from '../component/LMeshComponent.jsx';

import GeometryComponent from '../component/GeometryComponent.jsx';
import BoxGeometryComponent from '../component/geometry/BoxGeometryComponent.jsx';
import CylinderGeometryComponent from '../component/geometry/CylinderGeometryComponent.jsx';
import IcosahedronGeometryComponent from '../component/geometry/IcosahedronGeometryComponent.jsx';

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
            <CameraComponent></CameraComponent>
            <FireComponent></FireComponent>
            <LightComponent></LightComponent>
            <LMeshComponent></LMeshComponent>

            <GeometryComponent></GeometryComponent>
            <BoxGeometryComponent></BoxGeometryComponent>
            <CylinderGeometryComponent></CylinderGeometryComponent>
            <IcosahedronGeometryComponent></IcosahedronGeometryComponent>
        </PropertyGrid>;
    }
}

export default PropertyPanel;