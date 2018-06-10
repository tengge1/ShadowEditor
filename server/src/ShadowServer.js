import Config from './Config';
import ServiceDispatcher from './service/ServiceDispatcher';

/**
 * ShadowServer
 */
class ShadowServer {

    constructor() {
        this.service = new ServiceDispatcher(this);
    }

    start() {
        require('http').createServer((req, res) => {
            this.service.handle(req, res);
            // res.writeHead(200, {
            //     'Content-Type': 'text/plain'
            // });
            // res.end('Hello World\n');
        }).listen(Config.serverPort, Config.serverIP);

        console.log(`Server running at http://${Config.serverIP}:${Config.serverPort}/`);
    }
}

(new ShadowServer()).start();

export default ShadowServer;