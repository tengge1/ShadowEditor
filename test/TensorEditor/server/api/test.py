from server import context

app = context.app


@app.route('/api/test/hello')
def hello():
    return 'Hello, world!'
