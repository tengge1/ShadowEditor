import './css/Viewport.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Canvas from '../../media/Canvas.jsx';

/**
 * 画图区域
 * @author tengge / https://github.com/tengge1
 */
class Viewport extends React.Component {
    render() {
        return <Canvas className={'Viewport'}></Canvas>;
    }
}

export default Viewport;