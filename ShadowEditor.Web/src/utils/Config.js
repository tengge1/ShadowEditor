/**
 * 服务器配置
 * @author tengge / https://github.com/tengge1
 */
class Config {
    constructor() {
        this.enableAuthority = false; // 是否开启权限
        this.login = false; // 是否登录
    }

    load() {
        return new Promise(resolve => {
            fetch(`/api/Config/Get`).then(response => {
                response.json().then(json => {
                    this.enableAuthority = json.Data.EnableAuthority;
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