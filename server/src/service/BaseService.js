var ID = -1;

/**
 * BaseService
 */
class BaseService {

    constructor() {
        this.id = `BaseService${ID--}`;
    }

    handle(req, res) {
        throw 'BaseService: request method is not implemented.';
    }
}

export default BaseService;