/**
 * Config
 */
var Config = new (function () {
    // ShadowServer服务器配置
    this.serverIP = 'localhost';
    this.serverPort = 1337;

    // MongoDB配置
    this.mongoConnection = 'mongodb://localhost:27017/';
    this.mongoDbName = 'ShadowEditor';
});

export default Config;