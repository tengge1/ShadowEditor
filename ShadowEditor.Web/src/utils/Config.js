/**
 * 服务器配置
 * @author tengge / https://github.com/tengge1
 */
class Config {
    constructor() {
        this.enableAuthority = false; // 是否开启权限
        this.initialized = false; // 系统是否初始化
        this.login = false; // 是否登录
    }

    load() {
        return new Promise(resolve => {
            fetch(`/api/Config/Get`).then(response => {
                response.json().then(json => {
                    this.enableAuthority = json.Data.EnableAuthority;
                    this.initialized = json.Data.Initialized;
                    resolve();
                }).catch(e => {
                    console.warn(e);
                    app.toast(_t('Server configuration acquisition failed.'));
                    resolve();
                });
            }).catch(e => {
                console.warn(e);
                app.toast(_t('Server configuration acquisition failed.'));
                resolve();
            });
        });
    }
}

export default Config;