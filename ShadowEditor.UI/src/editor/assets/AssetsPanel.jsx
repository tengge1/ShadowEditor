import './css/AssetsPanel.css';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import AccordionLayout from '../../layout/AccordionLayout.jsx';

import Accordion from '../../layout/Accordion.jsx';

/**
 * 资源面板
 * @author tengge / https://github.com/tengge1
 */
class AssetsPanel extends React.Component {
    render() {
        return <AccordionLayout>
            <Accordion className={'ScenePanel'} title={'Scene'} maximizable={true}>Scene Panel</Accordion>
            <Accordion className={'ModelPanel'} title={'Model'} maximizable={true}>Model Panel</Accordion>
            <Accordion className={'MapPanel'} title={'Map'} maximizable={true}>Map Panel</Accordion>
            <Accordion className={'MaterialPanel'} title={'Material'} maximizable={true}>Material Panel</Accordion>
            <Accordion className={'AudioPanel'} title={'Audio'} maximizable={true}>Audio Panel</Accordion>
            <Accordion className={'AnimationPanel'} title={'Animation'} maximizable={true}>Animation Panel</Accordion>
            <Accordion className={'ParticlePanel'} title={'Particle'} maximizable={true}>Particle Panel</Accordion>
            <Accordion className={'PrefabPanel'} title={'Prefab'} maximizable={true}>Prefab Panel</Accordion>
            <Accordion className={'CharacterPanel'} title={'Character'} maximizable={true}>Character Panel</Accordion>
            <Accordion className={'LogPanel'} title={'Log'} maximizable={true}>Log Panel</Accordion>
        </AccordionLayout>;
    }
}

export default AssetsPanel;