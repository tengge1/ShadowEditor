import './css/EStatusBar.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Toolbar from '../toolbar/Toolbar.jsx';

import Label from '../form/Label.jsx';

/**
 * 菜单栏
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 */
class EStatusBar extends React.Component {
    render() {
        const { className, ...others } = this.props;

        return <Toolbar className={classNames('EStatusBar', className)} {...others}>
            <Label>Object</Label>
            <Label>198</Label>
            <Label>Vertex</Label>
            <Label>324,594</Label>
            <Label>Triangle</Label>
            <Label>108,198</Label>
        </Toolbar>;
    }
}

EStatusBar.propTypes = {
    className: PropTypes.string,
};

export default EStatusBar;