import os
import sys
import importlib
import pkgutil
from flask import Flask, url_for, render_template, request, session, json, send_from_directory, current_app, g
from server import context

app = Flask(__name__, static_folder='', static_url_path='')
app.config['SECRET_KEY'] = 'ShadowEditor.AI'

context.app = app

# 动态加载server.api包
dir = os.path.split(sys.argv[0])[0]

for loader, module_name, is_pkg in pkgutil.walk_packages([f'{dir}\\server\\api']):
    module = f'server.api.{module_name}'
    try:
        importlib.import_module(module)
        print(f'Loading module {module}')
    except ImportError as e:
        print(e)


# 首页
@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')


# 启动Flask应用程序
if __name__ == '__main__':
	app.run(
            host='0.0.0.0',
            port=5000,
            debug=True
        )
