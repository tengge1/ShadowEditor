import './css/AssetsPanel.css';

import { classNames, PropTypes, AccordionLayout, Accordion } from '../../third_party';

import ScenePanel from './ScenePanel.jsx';
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
        };

        this.handleActive = this.handleActive.bind(this);
    }

    render() {
        const { activeIndex } = this.state;

        return <AccordionLayout className={'AssetsPanel'} onActive={this.handleActive}>
            <Accordion name={'Scene'} title={`${_t('Scene')}`} maximizable={true}>
                <ScenePanel className={'subPanel'} show={0 === activeIndex}></ScenePanel>
            </Accordion>
            <Accordion name={'Log'} title={`${_t('Logs')}`} maximizable={true}>
                <LogPanel className={'subPanel'} show={9 === activeIndex}></LogPanel>
            </Accordion>
        </AccordionLayout>;
    }

    handleActive(index, name) {
        this.setState({
            activeIndex: index,
        });
    }
}

export default AssetsPanel;