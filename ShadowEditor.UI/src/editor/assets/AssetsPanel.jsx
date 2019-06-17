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
            <Panel className={'ScenePanel'} title={'Scene'} maximizable={true}>Scene Panel</Panel>
            <Panel className={'ModelPanel'} title={'Model'} maximizable={true}>Model Panel</Panel>
            <Panel className={'MapPanel'} title={'Map'} maximizable={true}>Map Panel</Panel>
            <Panel className={'MaterialPanel'} title={'Material'} maximizable={true}>Material Panel</Panel>
            <Panel className={'AudioPanel'} title={'Audio'} maximizable={true}>Audio Panel</Panel>
            <Panel className={'AnimationPanel'} title={'Animation'} maximizable={true}>Animation Panel</Panel>
            <Panel className={'ParticlePanel'} title={'Particle'} maximizable={true}>Particle Panel</Panel>
            <Panel className={'PrefabPanel'} title={'Prefab'} maximizable={true}>Prefab Panel</Panel>
            <Panel className={'CharacterPanel'} title={'Character'} maximizable={true}>Character Panel</Panel>
            <Panel className={'LogPanel'} title={'Log'} maximizable={true}>Log Panel</Panel>
        </AccordionLayout>;
    }
}

export default AssetsPanel;