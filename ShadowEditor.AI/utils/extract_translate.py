import json
import os
import re

# 提取ShadowEditor.AI中的英文文本，将未翻译的放到`zh-CN.json`文件中。


# 从源码中查找所有英文文本
english_words = []


def find_english(path):
    file = open(path, encoding='utf-8')
    data = file.read()
    file.close()

    pattern = re.compile(r"_t\('[\w\s]*'\)")
    results = pattern.findall(data)

    for result in results:
        english_words.append(result[4:-2])


# 从中文语言包中提取所有中文
chinese_words = {}


def find_chinese():
    file = open(
        r'E:\github\ShadowEditor\ShadowEditor.AI\locales\zh-CN.json', encoding='utf-8')
    data = file.read()
    file.close()
    chinese_words = json.loads(data)

# 将未翻译的英文放到中文语言包中


def put_words():
    for i in english_words:
        if i not in chinese_words:
            chinese_words[i] = i

    file = open(
        'E:\github\ShadowEditor\ShadowEditor.AI\locales\zh-CN.json', 'w', encoding='utf-8')
    file.write(json.dumps(chinese_words, ensure_ascii=False))
    file.close()


    # 遍历源码目录
list = os.walk(r'E:\github\ShadowEditor\ShadowEditor.AI\src')

for root, dirs, files in list:
    for name in files:
        find_english(os.path.join(root, name))

find_chinese()
put_words()

print('Done!')
