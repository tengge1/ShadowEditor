import './css/Alert.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import Window from './Window.jsx';
import Content from '../common/Content.jsx';
import Buttons from '../common/Buttons.jsx';
import Button from '../form/Button.jsx';

/**
 * 提示框
 */
class Alert extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { className, style, title, children, hidden, mask, okText } = this.props;

        return <Window
            className={className}
            style={style}
            title={title}
            hidden={hidden}
            mask={mask}
        >
            <Content>{children}</Content>
            <Buttons>
                <Button>{okText}</Button>
            </Buttons>
        </Window>;
    }
}

Alert.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    children: PropTypes.node,
    hidden: PropTypes.bool,
    mask: PropTypes.bool,
    okText: PropTypes.string,
};

Alert.defaultProps = {
    className: null,
    style: null,
    title: 'Message',
    children: null,
    hidden: false,
    mask: true,
    okText: 'OK',
};

export default Alert;