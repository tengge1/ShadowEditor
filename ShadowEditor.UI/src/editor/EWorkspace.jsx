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
    render() {
        const { className, ...others } = this.props;

        return <BorderLayout className={classNames('EWorkspace', className)} {...others}>
            <Panel title={'North'} region={'north'} split={true} style={{ height: '120px', border: 'none' }}></Panel>
            <Panel title={'South'} region={'south'} split={true} style={{ height: '120px', border: 'none' }}></Panel>
            <Panel title={'West'} region={'west'} split={true} style={{ width: '200px', border: 'none' }}></Panel>
            <Panel title={'East'} region={'east'} split={true} style={{ width: '200px', border: 'none' }}></Panel>
            <Panel title={'Center'}
                region={'center'}
                collapsible={true}
                maximizable={true}
                minimizable={true}
                closable={true}
                style={{ border: 'none' }}></Panel>
        </BorderLayout>;
    }
}

EWorkspace.propTypes = {
    className: PropTypes.string,
};

export default EWorkspace;