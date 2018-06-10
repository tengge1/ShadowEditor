import BaseService from './BaseService';
import SceneService from './SceneService';
import TextureService from './TextureService';

/**
 * ServiceDispatcher
 */
class ServiceDispatcher extends BaseService {

    handle(req, res) {
        var url = require('url').parse(req);
    }

}

export default ServiceDispatcher;