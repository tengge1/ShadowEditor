import os
import sys
import importlib
import pkgutil
from flask import Flask, url_for, render_template, request, session, json, send_from_directory, current_app, g
from server import context

app = Flask(__name__, static_folder='', static_url_path='')
app.config['SECRET_KEY'] = 'ShadowEditor.AI'

context.app = app

# 动态加载server包
dir = os.path.split(sys.argv[0])[0]

for loader, module_name, is_pkg in pkgutil.walk_packages([f'{dir}\\server\\api']):
    if module_name == 'context':
        continue
    try:
        print(module_name)
        importlib.import_module(f'server.api.{module_name}')
    except ImportError as e:
        print(e)


@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')


if __name__ == '__main__':
	app.run(
            host='0.0.0.0',
            port=5000,
            debug=True
        )
