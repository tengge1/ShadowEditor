import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import AccordionLayout from '../../layout/AccordionLayout.jsx';
import Accordion from '../../common/Accordion.jsx';

/**
 * 资源面板
 * @author tengge / https://github.com/tengge1
 */
class AssetsPanel extends React.Component {
    render() {
        return <AccordionLayout>
            <Accordion title={'Scene'} maximizable={true}>Scene Panel</Accordion>
            <Accordion title={'Model'} maximizable={true}>Model Panel</Accordion>
            <Accordion title={'Map'} maximizable={true}>Map Panel</Accordion>
            <Accordion title={'Material'} maximizable={true}>Material Panel</Accordion>
            <Accordion title={'Audio'} maximizable={true}>Audio Panel</Accordion>
            <Accordion title={'Animation'} maximizable={true}>Animation Panel</Accordion>
            <Accordion title={'Particle'} maximizable={true}>Particle Panel</Accordion>
            <Accordion title={'Prefab'} maximizable={true}>Prefab Panel</Accordion>
            <Accordion title={'Character'} maximizable={true}>Character Panel</Accordion>
            <Accordion title={'Log'} maximizable={true}>Log Panel</Accordion>
        </AccordionLayout>;
    }
}

export default AssetsPanel;