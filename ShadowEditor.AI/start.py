import json

# 读取英文语言文件
file = open(
    'E:\github\ShadowEditor\ShadowEditor.Web\src\language\Language.js', encoding='utf-8')
list = file.read().split('\n')
file.close()

en = {}

for i in list:
    line = i.strip()
    if not line.startswith('L_'):
        continue
    items = line.split(':')
    key = items[0].strip().replace('L_', '')
    value = items[1].replace("'", '').replace(',', '').strip()
    en[key] = value

# print(en)

# 读取中文语言文件
file = open('E:\github\ShadowEditor\ShadowEditor.Web\lang\zh-CN.js',
            encoding='utf-8')
list = file.read().split('\n')
file.close()

cn = {}

for i in list:
    line = i.strip()
    if not line.startswith('L_'):
        continue
    items = line.split('=')
    key = items[0].strip().replace('L_', '')
    value = items[1].replace("'", '').replace(';', '').strip()
    cn[key] = value

# print(cn)

# 写入语言文件

lang = {}

for key in en:
    lang[en[key]] = cn[key]

file = open('E:\github\ShadowEditor\ShadowEditor.Web\locales\zh-CN.json',
            'w', encoding='utf-8')
file.write(json.dumps(lang, ensure_ascii=False))
