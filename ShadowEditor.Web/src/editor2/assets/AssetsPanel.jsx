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
    }

    render() {
        const { sceneCount, meshCount, mapCount, materialCount, audioCount, animationCount, particleCount, prefabCount, characterCount } = this.state;

        return <AccordionLayout>
            <Accordion title={`${L_SCENE}(${sceneCount})`} maximizable={true}>
                <ScenePanel></ScenePanel>
            </Accordion>
            <Accordion title={`${L_MODEL}(${meshCount})`} maximizable={true}>
                <ModelPanel></ModelPanel>
            </Accordion>
            <Accordion title={`${L_MAP}(${mapCount})`} maximizable={true}>
                <MapPanel></MapPanel>
            </Accordion>
            <Accordion title={`${L_MATERIAL}(${materialCount})`} maximizable={true}>
                <MaterialPanel></MaterialPanel>
            </Accordion>
            <Accordion title={`${L_AUDIO}(${audioCount})`} maximizable={true}>
                <AudioPanel></AudioPanel>
            </Accordion>
            <Accordion title={`${L_ANIMATION}(${animationCount})`} maximizable={true}>
                <AnimationPanel></AnimationPanel>
            </Accordion>
            <Accordion title={`${L_PARTICLE}(${particleCount})`} maximizable={true}>
                <ParticlePanel></ParticlePanel>
            </Accordion>
            <Accordion title={`${L_PREFAB}(${prefabCount})`} maximizable={true}>
                <PrefabPanel></PrefabPanel>
            </Accordion>
            <Accordion title={`${L_CHARACTER}(${characterCount})`} maximizable={true}>
                <CharacterPanel></CharacterPanel>
            </Accordion>
            <Accordion title={`${L_LOG}`} maximizable={true}>
                <LogPanel></LogPanel>
            </Accordion>
        </AccordionLayout>;
    }

    componentDidMount() {
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
}

export default AssetsPanel;