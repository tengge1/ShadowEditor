import './css/Toolbar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import _Toolbar from '../toolbar/Toolbar.jsx';
import IconButton from '../form/IconButton.jsx';

/**
 * 工具栏
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class Toolbar extends React.Component {
    render() {
        const { className, style } = this.props;

        return <_Toolbar direction={'vertical'} className={classNames('EditorToolbar', className)} style={style}>
            <IconButton icon={'select'}></IconButton>
            <IconButton icon={'translate'}></IconButton>
            <IconButton icon={'rotate'}></IconButton>
            <IconButton icon={'scale'}></IconButton>
            <IconButton icon={'point'}></IconButton>
            <IconButton icon={'line'}></IconButton>
            <IconButton icon={'spray'}></IconButton>
            <IconButton icon={'texture'}></IconButton>
        </_Toolbar>;
    }
}

Toolbar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default Toolbar;