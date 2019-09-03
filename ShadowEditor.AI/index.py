from flask import Flask, url_for, render_template, request, session, json, send_from_directory, current_app, g

app = Flask(__name__, static_folder='', static_url_path='')
app.config['SECRET_KEY'] = 'ShadowEditor.AI'


@app.route('/')
@app.route('/index')
def index(category_id=None):
	return render_template('index.html')


if __name__ == '__main__':
	app.run(
            host='0.0.0.0',
            port=5000,
            debug=True
        )
