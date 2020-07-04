/*
 * Copyright 2017-2020 The ShadowEditor Authors. All rights reserved.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file.
 * 
 * For more information, please visit: https://github.com/tengge1/ShadowEditor
 * You can also visit: https://gitee.com/tengge1/ShadowEditor
 */
import './css/LogPanel.css';
import { classNames, PropTypes } from '../../third_party';
import { Button } from '../../ui/index';

/**
 * 日志面板
 * @author tengge / https://github.com/tengge1
 */
class LogPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            logs: []
        };

        this.handleLog = this.handleLog.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }

    render() {
        const { className, style } = this.props;
        const { logs } = this.state;

        return <div className={classNames('LogPanel', className)}
            style={style}
               >
            <Button onClick={this.handleClear}>{_t('Clear')}</Button>
            <div className={'logs'}>
                {logs.map((n, i) => {
                    return <div className={n.type}
                        key={i}
                           >{n.time} {n.content}</div>;
                })}
            </div>
        </div>;
    }

    componentDidMount() {
        app.on(`log.LogPanel`, this.handleLog);
    }

    handleLog(content, type) {
        var date = new Date();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        hour = hour < 10 ? '0' + hour : hour;
        minute = minute < 10 ? '0' + minute : minute;
        second = second < 10 ? '0' + second : second;

        this.setState(state => {
            let logs = state.logs;

            logs.push({
                time: `${hour}:${minute}:${second}`,
                type,
                content
            });

            return {
                logs
            };
        });
    }

    handleClear() {
        this.setState({
            logs: []
        });
    }
}

LogPanel.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool
};

LogPanel.defaultProps = {
    className: null,
    style: null,
    show: false
};

export default LogPanel;