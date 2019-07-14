import { PropertyGrid, PropertyGroup, TextProperty } from '../../third_party';

/**
 * 基本信息组件
 * @author tengge / https://github.com/tengge1
 */
class BasicComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: true,
        };

        this.handleExpand = this.handleExpand.bind(this);
    }

    render() {
        const { expanded } = this.state;

        return <PropertyGroup name={L_BASIC_INFO} expanded={expanded} onExpand={this.handleExpand}>
            <TextProperty name={'name'} label={L_NAME} value={'正方体'}></TextProperty>
            <TextProperty name={'type'} label={L_TYPE} value={'类型'}></TextProperty>
        </PropertyGroup>;
    }

    handleExpand(expanded) {
        this.setState({
            expanded,
        });
    }
}

export default BasicComponent;