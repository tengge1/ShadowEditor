class Alert extends React.Component {
    render() {
        const { title, children } = this.props;
        return <div className="Alert">
            <div className="wrap">
                <div className="title">
                    <span>{title || 'Message'}</span>
                    <div className="controls">
                        <i className="iconfont icon-close icon"></i>
                    </div>
                </div>
                <div className="content">{children}</div>
                <div className="buttons">
                    <div className="button-wrap">
                        <button className="button">OK</button>
                    </div>
                </div>
            </div>
            <div className="resize"></div>
        </div>;
    }
}

export default Alert;