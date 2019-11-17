/**
 * 服务端功能
 * @author tengge / https://github.com/tengge1
 */
class Server {
    constructor() {
        this.enableAuthority = false; // 是否开启权限
        this.initialized = false; // 系统是否初始化

        this.isLogin = false; // 是否登录
        this.username = ''; // 登录用户名
        this.name = ''; // 登录姓名

        this.roleName = ''; // 角色名称
        this.deptName = ''; // 机构名称
        this.authorities = []; // 权限列表
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

                    this.roleName = obj.Data.RoleName;
                    this.deptName = obj.Data.DeptName;
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

    login(username, password) {
        return new Promise(resolve => {
            fetch(`/api/Login/Login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `Username=${username}&Password=${password}`
            }).then(response => {
                response.json().then(obj => {
                    if (obj.Code !== 200) {
                        app.toast(_t(obj.Msg));
                        resolve(false);
                        return;
                    }
                    this.isLogin = true;
                    this.username = obj.Data.Username;
                    this.name = obj.Data.Name;
                    app.call('login', this);
                    resolve(true);
                });
            });
        });
    }

    logout() {
        return new Promise(resolve => {
            fetch(`/api/Login/Logout`, {
                method: 'POST'
            }).then(response => {
                response.json().then(obj => {
                    if (obj.Code !== 200) {
                        app.toast(_t(obj.Msg));
                        resolve(false);
                        return;
                    }
                    this.isLogin = false;
                    this.username = '';
                    this.name = '';
                    app.call('logout', this);
                    resolve(true);
                });
            });
        });
    }
}

export default Server;