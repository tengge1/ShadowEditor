class BorderLayout extends React.Component {
    render() {
        const { className, children } = this.props;

        return <>{children}</>;
    }
}

export default BorderLayout;