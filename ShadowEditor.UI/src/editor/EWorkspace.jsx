import './css/EWorkspace.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

// form
import Button from '../form/Button.jsx';
import CheckBox from '../form/CheckBox.jsx';
import Form from '../form/Form.jsx';
import FormControl from '../form/FormControl.jsx';
import Input from '../form/Input.jsx';
import Label from '../form/Label.jsx';
import Radio from '../form/Radio.jsx';
import TextArea from '../form/TextArea.jsx';
import Toggle from '../form/Toggle.jsx';

// layout
import VBoxLayout from '../layout/VBoxLayout.jsx';

// panel
import Panel from '../panel/Panel.jsx';

/**
 * 工作区
 * @author tengge / https://github.com/tengge1
 * @property {String} className 样式类
 * @property {Object} style 样式
 */
class EWorkspace extends React.Component {
    render() {
        const { className, style } = this.props;

        return <VBoxLayout className={classNames('EWorkspace', className)} style={style}>
        </VBoxLayout>;
    }
}

EWorkspace.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

export default EWorkspace;