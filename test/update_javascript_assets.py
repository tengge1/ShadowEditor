import os
import json

# 自动生成js资源json文件：`\ShadowEditor.Web\assets\js_assets.json`

root_path = os.getcwd()
js_assets_path = '%s\\ShadowEditor.Web\\assets\\js' % root_path
json_path = '%s\\ShadowEditor.Web\\assets\\js_assets.json' % root_path

list = []
name_list = []


def handle(path):
    parts = path.split('\\')
    names = parts[len(parts) - 1].split('.')

    if names[len(names) - 1] != 'js':
        return

    name = ''.join(names[:-1])

    if name in name_list:
        print('%s is already existed!' % name)

    name_list.append(name)

    list.append({
        'name': name,
        'assets': [
            path
        ]
    })


for root, dirs, files in os.walk(js_assets_path):
    for i in files:
        file = '%s\\%s' % (root, i)
        handle(file)

data = json.dumps(list, ensure_ascii=False)

file = open(json_path, 'wb')
file.write(data.encode('utf-8'))
file.close()

print('Completed!')
