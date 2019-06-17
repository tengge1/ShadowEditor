import './css/AssetsPanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import AccordionLayout from '../../layout/AccordionLayout.jsx';

import Panel from '../../panel/Panel.jsx';

/**
 * 资源面板
 * @author tengge / https://github.com/tengge1
 */
class AssetsPanel extends React.Component {
    render() {
        return <AccordionLayout>
            <Panel className={'AssetsPanel'} title={'Assets Panel'} maximizable={true}>Assets Panel</Panel>
        </AccordionLayout>;
    }
}

export default AssetsPanel;