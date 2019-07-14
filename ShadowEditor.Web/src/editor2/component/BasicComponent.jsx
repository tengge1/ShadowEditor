import { PropertyGrid, PropertyGroup, TextProperty } from '../../third_party';

/**
 * 基本信息组件
 * @author tengge / https://github.com/tengge1
 */
class BasicComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <PropertyGroup name={L_BASIC_INFO}>
            <TextProperty name={'name'} label={L_NAME} value={'正方体'}></TextProperty>
        </PropertyGroup>;
    }
}

export default BasicComponent;