import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import AccordionLayout from '../../layout/AccordionLayout.jsx';
import Accordion from '../../common/Accordion.jsx';

import ScenePanel from './ScenePanel.jsx';
import ModelPanel from './ModelPanel.jsx';
import MapPanel from './MapPanel.jsx';
import MaterialPanel from './MaterialPanel.jsx';
import AudioPanel from './AudioPanel.jsx';
import AnimationPanel from './AnimationPanel.jsx';
import ParticlePanel from './ParticlePanel.jsx';
import PrefabPanel from './PrefabPanel.jsx';
import CharacterPanel from './CharacterPanel.jsx';
import LogPanel from './LogPanel.jsx';

/**
 * 资源面板
 * @author tengge / https://github.com/tengge1
 */
class AssetsPanel extends React.Component {
    render() {
        return <AccordionLayout>
            <Accordion title={'Scene'} maximizable={true}>
                <ScenePanel></ScenePanel>
            </Accordion>
            <Accordion title={'Model'} maximizable={true}>
                <ModelPanel></ModelPanel>
            </Accordion>
            <Accordion title={'Map'} maximizable={true}>
                <MapPanel></MapPanel>
            </Accordion>
            <Accordion title={'Material'} maximizable={true}>
                <MaterialPanel></MaterialPanel>
            </Accordion>
            <Accordion title={'Audio'} maximizable={true}>
                <AudioPanel></AudioPanel>
            </Accordion>
            <Accordion title={'Animation'} maximizable={true}>
                <AnimationPanel></AnimationPanel>
            </Accordion>
            <Accordion title={'Particle'} maximizable={true}>
                <ParticlePanel></ParticlePanel>
            </Accordion>
            <Accordion title={'Prefab'} maximizable={true}>
                <PrefabPanel></PrefabPanel>
            </Accordion>
            <Accordion title={'Character'} maximizable={true}>
                <CharacterPanel></CharacterPanel>
            </Accordion>
            <Accordion title={'Log'} maximizable={true}>
                <LogPanel></LogPanel>
            </Accordion>
        </AccordionLayout>;
    }
}

export default AssetsPanel;