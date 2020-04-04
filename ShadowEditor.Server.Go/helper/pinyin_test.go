package helper

import "testing"

func TestConvertToPinYin(t *testing.T) {
	text := "中国人"
	pinyin := ConvertToPinYin(text)

	if pinyin.FirstPinYin[0] != "z" || pinyin.FirstPinYin[1] != "g" || pinyin.FirstPinYin[2] != "r" {
		t.Errorf("first pinyin should be `z` `g` `r`, get `%v` `%v` `%v`", pinyin.FirstPinYin[0], pinyin.FirstPinYin[1], pinyin.FirstPinYin[2])
		return
	}

	if pinyin.TotalPinYin[0] != "zhong" || pinyin.TotalPinYin[1] != "guo" || pinyin.TotalPinYin[2] != "ren" {
		t.Errorf("first pinyin should be `zhong` `guo` `ren`, get `%v` `%v` `%v`", pinyin.TotalPinYin[0], pinyin.TotalPinYin[1], pinyin.TotalPinYin[2])
		return
	}

	t.Log(pinyin)
}
