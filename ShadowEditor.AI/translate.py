import requests
import json
from bs4 import BeautifulSoup
import execjs  # 必须，需要先用pip 安装，用来执行js脚本

# Python调用谷歌翻译制作语言包
# 作者：https://www.jianshu.com/p/95cf6e73d6ee


class Py4Js():
  def __init__(self):
    self.ctx = execjs.compile("""
    function TL(a) {
    var k = "";
    var b = 406644;
    var b1 = 3293161072;
    var jd = ".";
    var $b = "+-a^+6";
    var Zb = "+-3^+b+-f";
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var m = a.charCodeAt(g);
        128 > m ? e[f++] = m : (2048 > m ? e[f++] = m >> 6 | 192 : (55296 == (m & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (m = 65536 + ((m & 1023) << 10) + (a.charCodeAt(++g) & 1023),
        e[f++] = m >> 18 | 240,
        e[f++] = m >> 12 & 63 | 128) : e[f++] = m >> 12 | 224,
        e[f++] = m >> 6 & 63 | 128),
        e[f++] = m & 63 | 128)
    }
    a = b;
    for (f = 0; f < e.length; f++) a += e[f],
    a = RL(a, $b);
    a = RL(a, Zb);
    a ^= b1 || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return a.toString() + jd + (a ^ b)
  };
  function RL(a, b) {
    var t = "a";
    var Yb = "+";
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2),
        d = d >= t ? d.charCodeAt(0) - 87 : Number(d),
        d = b.charAt(c + 1) == Yb ? a >>> d: a << d;
        a = b.charAt(c) == Yb ? a + d & 4294967295 : a ^ d
    }
    return a
  }
 """)

  def getTk(self, text):
      return self.ctx.call("TL", text)


def buildUrl(text, tk):
  #return 'https://translate.google.cn/translate_a/single?client=webapp&sl=zh-CN&tl=zh-TW&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&otf=1&ssel=0&tsel=0&kc=1&tk=' + tk + '&q=' + text  # 中文翻译繁体中文
  #return 'https://translate.google.cn/translate_a/single?client=webapp&sl=zh-CN&tl=ja&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&source=bh&ssel=0&tsel=0&kc=1&tk=' + tk + '&q=' + text # 中文翻译日语
  #return 'https://translate.google.cn/translate_a/single?client=webapp&sl=zh-CN&tl=ko&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ssel=0&tsel=4&kc=0&tk=' + tk + '&q=' + text # 中文翻译韩语
  #return 'https://translate.google.cn/translate_a/single?client=webapp&sl=zh-CN&tl=ru&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&otf=1&ssel=3&tsel=4&kc=1&tk=' + tk + '&q=' + text # 中文翻译俄语
  return 'https://translate.google.cn/translate_a/single?client=webapp&sl=zh-CN&tl=fr&hl=zh-CN&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&otf=1&ssel=0&tsel=4&kc=1&tk=' + tk + '&q=' + text  # 中文翻译法语


def translate(text):
  header = {
      'authority': 'translate.google.cn',
      'method': 'GET',
      'path': '',
      'scheme': 'https',
      'accept': '*/*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cookie': '',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64)  AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.108 Safari/537.36',
      'x-client-data': 'CIa2yQEIpbbJAQjBtskBCPqcygEIqZ3KAQioo8oBGJGjygE='
  }
  url = buildUrl(text, js.getTk(text))
  res = ''
  try:
      r = requests.get(url)
      print(r)
      result = json.loads(r.text)
      if result[7] != None:
        # 如果我们文本输错，提示你是不是要找xxx的话，那么重新把xxx正确的翻译之后返回
          try:
              correctText = result[7][0].replace(
                  '<b><i>', ' ').replace('</i></b>', '')
              print(correctText)
              correctUrl = buildUrl(correctText, js.getTk(correctText))
              correctR = requests.get(correctUrl)
              newResult = json.loads(correctR.text)
              res = newResult[0][0][0]
          except Exception as e:
              print(e)
              res = result[0][0][0]
      else:
          res = result[0][0][0]
  except Exception as e:
      res = ''
      print(url)
      print("翻译"+text+"失败")
      print("错误信息:")
      print(e)
  finally:
      return res


js = Py4Js()

# 将一种语言翻译成另外一种语言
file = open(
    'E:\github\ShadowEditor\ShadowEditor.Web\locales\zh-CN.json', encoding='utf-8')
data = file.read()
file.close()

list = json.loads(data)
#print(list)

list2 = {}

for key in list:
  value = translate(list[key])
  list2[key] = value
  print(key)

file = open('E:\github\ShadowEditor\ShadowEditor.Web\locales\\fr-FR.json',
            'w', encoding='utf-8')
file.write(json.dumps(list2, ensure_ascii=False))
file.close()

#res = translate('日语')
#print(res)
