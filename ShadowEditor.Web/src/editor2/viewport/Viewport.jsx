import './css/Viewport.css';
import { classNames, PropTypes, Canvas } from '../../third_party';

/**
 * 视口
 * @author tengge / https://github.com/tengge1
 */
class Viewport extends React.Component {
    constructor(props) {
        super(props);
        this.dom = React.createRef();
    }

    componentDidMount() {
        app.viewport = this.dom.current;
    }

    render() {
        return <div className={'Viewport'} ref={this.dom}></div>;
    }
}

export default Viewport;