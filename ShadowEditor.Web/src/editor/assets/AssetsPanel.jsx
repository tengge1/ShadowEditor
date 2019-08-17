import './css/AssetsPanel.css';

import { classNames, PropTypes, AccordionLayout, Accordion } from '../../third_party';

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
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            sceneCount: 0,
            meshCount: 0,
            mapCount: 0,
            materialCount: 0,
            audioCount: 0,
            animationCount: 0,
            particleCount: 0,
            prefabCount: 0,
            characterCount: 0,
        };

        this.handleActive = this.handleActive.bind(this);
    }

    render() {
        const { activeIndex, sceneCount, meshCount, mapCount, materialCount, audioCount, animationCount, particleCount, prefabCount, characterCount } = this.state;

        return <AccordionLayout className={'AssetsPanel'} onActive={this.handleActive}>
            <Accordion name={'Scene'} title={`${_t('Scene')}(${sceneCount})`} maximizable={true}>
                <ScenePanel className={'subPanel'} show={0 === activeIndex}></ScenePanel>
            </Accordion>
            <Accordion name={'Model'} title={`${_t('Model')}(${meshCount})`} maximizable={true}>
                <ModelPanel className={'subPanel'} show={1 === activeIndex}></ModelPanel>
            </Accordion>
            <Accordion name={'Map'} title={`${_t('Map')}(${mapCount})`} maximizable={true}>
                <MapPanel className={'subPanel'} show={2 === activeIndex}></MapPanel>
            </Accordion>
            <Accordion name={'Material'} title={`${_t('Material')}(${materialCount})`} maximizable={true}>
                <MaterialPanel className={'subPanel'} show={3 === activeIndex}></MaterialPanel>
            </Accordion>
            <Accordion name={'Audio'} title={`${_t('Audio')}(${audioCount})`} maximizable={true}>
                <AudioPanel className={'subPanel'} show={4 === activeIndex}></AudioPanel>
            </Accordion>
            <Accordion name={'Animation'} title={`${_t('Animation')}(${animationCount})`} maximizable={true}>
                <AnimationPanel className={'subPanel'} show={5 === activeIndex}></AnimationPanel>
            </Accordion>
            <Accordion name={'Particle'} title={`${_t('Particle')}(${particleCount})`} maximizable={true}>
                <ParticlePanel className={'subPanel'} show={6 === activeIndex}></ParticlePanel>
            </Accordion>
            <Accordion name={'Prefab'} title={`${_t('Prefab')}(${prefabCount})`} maximizable={true}>
                <PrefabPanel className={'subPanel'} show={7 === activeIndex}></PrefabPanel>
            </Accordion>
            <Accordion name={'Character'} title={`${_t('Character')}(${characterCount})`} maximizable={true}>
                <CharacterPanel className={'subPanel'} show={8 === activeIndex}></CharacterPanel>
            </Accordion>
            <Accordion name={'Log'} title={`${_t('Logs')}`} maximizable={true}>
                <LogPanel className={'subPanel'} show={9 === activeIndex}></LogPanel>
            </Accordion>
        </AccordionLayout>;
    }

    componentDidMount() {
        this.update();
    }

    update() {
        fetch(`${app.options.server}/api/Assets/List`).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    this.setState({
                        sceneCount: json.sceneCount,
                        meshCount: json.meshCount,
                        mapCount: json.mapCount,
                        materialCount: json.materialCount,
                        audioCount: json.audioCount,
                        animationCount: json.animationCount,
                        particleCount: json.particleCount,
                        prefabCount: json.prefabCount,
                        characterCount: json.characterCount,
                    });
                });
            }
        });
    }

    handleActive(index, name) {
        this.setState({
            activeIndex: index,
        });
    }
}

export default AssetsPanel;