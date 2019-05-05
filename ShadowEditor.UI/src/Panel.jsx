// const styles = {
//     button: {
//         fontSize: 12,
//         '&:hover': {
//             background: 'blue'
//         }
//     },
//     ctaButton: {
//         extend: 'button',
//         '&:hover': {
//             background: color('blue')
//                 .darken(0.3)
//                 .hex()
//         }
//     },
//     '@media (min-width: 1024px)': {
//         button: {
//             width: 200
//         }
//     }
// };

// const { classes } = jss.createStyleSheet(styles).attach();

/**
 * Panel
 */
class Panel extends React.Component {
    render() {
        const { width, height, title, children } = this.props;

        return <div className="Panel">
            <div className="wrap">
                <div className="title">
                    <div className="icon">
                        <i className="iconfont icon-shadow"></i>
                    </div>
                    <span>{title}</span>
                    <div className="controls">
                        <div className="control">
                            <i className="iconfont icon-maximize"></i>
                        </div>
                        <div className="control">
                            <i className="iconfont icon-minus"></i>
                        </div>
                        <div className="control">
                            <i className="iconfont icon-close"></i>
                        </div>
                    </div>
                </div>
                <div className="content">
                    {children}
                </div>
            </div>
            <div className="resize"></div>
        </div>;
    }
}

export default Panel;