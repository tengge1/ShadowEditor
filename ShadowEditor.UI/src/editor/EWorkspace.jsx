import './css/EWorkspace.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import BorderLayout from '../layout/BorderLayout.jsx';
import Panel from '../panel/Panel.jsx';

/**
 * 工作区
 * @author tengge / https://github.com/tengge1
 */
class EWorkspace extends React.Component {
    constructor(props) {
        super(props);
    }

    handleInput(value) {
        this.setState({
            inputValue: value,
        });
    }

    render() {
        const { className, ...others } = this.props;

        return <BorderLayout className={classNames('EWorkspace', className)} {...others}>
            <Panel title={'North'} header={false} region={'north'} split={true}></Panel>
            <Panel title={'South'} region={'south'} split={true}></Panel>
            <Panel title={'West'} region={'west'} split={true}></Panel>
            <Panel title={'East'} region={'east'} split={true}></Panel>
        </BorderLayout>;
    }
}

EWorkspace.propTypes = {
    className: PropTypes.string,
};

export default EWorkspace;