import Panel from './panel/Panel.jsx';

/**
 * 应用程序
 */
class Application {
    render() {
        const component = <Panel></Panel>;

        ReactDOM.render(component, document.querySelector('#container'));
    }
}

export default Application;