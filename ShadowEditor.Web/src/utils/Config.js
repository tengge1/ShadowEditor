/**
 * 服务器配置
 * @author tengge / https://github.com/tengge1
 */
class Config {
    constructor() {
        this.enableAuthority = false; // 是否开启权限
        this.initialized = false; // 系统是否初始化
        this.isLogin = false; // 是否登录
        this.username = ''; // 登录用户名
        this.name = ''; // 登录姓名
    }

    load() {
        return new Promise(resolve => {
            fetch(`/api/Config/Get`).then(response => {
                response.json().then(obj => {
                    if (obj.Code !== 200) {
                        app.toast(_t(obj.Msg));
                        return;
                    }
                    this.enableAuthority = obj.Data.EnableAuthority;
                    this.initialized = obj.Data.Initialized;
                    this.isLogin = obj.Data.IsLogin;
                    this.username = obj.Data.Username;
                    this.name = obj.Data.Name;
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