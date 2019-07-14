import './css/PropertyPanel.css';
import { classNames, PropTypes, PropertyGrid } from '../../third_party';
import BasicComponent from '../component/BasicComponent.jsx';

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
        </PropertyGrid>;
    }
}

export default PropertyPanel;