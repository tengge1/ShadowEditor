package helper

import "testing"

func TestConvertToPinYin(t *testing.T) {
	text := "中国人"
	pinyin := ConvertToPinYin(text)

	if pinyin.FirstPinYin != "zgr" {
		t.Errorf("first pinyin should be `zgr`, get `%v`", pinyin.FirstPinYin)
		return
	}

	if pinyin.TotalPinYin != "zhongguoren" {
		t.Errorf("first pinyin should be `zhongguoren`, get `%v`", pinyin.TotalPinYin)
		return
	}

	t.Log(pinyin)
}
