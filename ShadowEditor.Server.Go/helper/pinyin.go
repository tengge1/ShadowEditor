package helper

import (
	"github.com/mozillazg/go-pinyin"
)

// ConvertToPinYin 汉字转拼音
func ConvertToPinYin(text string) (model PinYinModel) {
	args := pinyin.NewArgs()
	pinyin := pinyin.LazyPinyin(text, args)

	for _, item := range pinyin {
		model.TotalPinYin = append(model.TotalPinYin, item)
		model.FirstPinYin = append(model.FirstPinYin, string(item[0]))
	}

	return
}

// PinYinModel 返回拼音模型
type PinYinModel struct {
	// TotalPinYin 全拼
	TotalPinYin []string
	// FirstPinYin 首拼
	FirstPinYin []string
}
