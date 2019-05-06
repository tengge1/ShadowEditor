import classNames from 'classnames/bind';

class HBoxLayout extends React.Component {
    render() {
        const { className, children } = this.props;

        return <div className={classNames('HBox', className)}>{children}</div>;
    }
}

export default HBoxLayout;