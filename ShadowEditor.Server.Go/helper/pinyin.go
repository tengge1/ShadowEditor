package helper

import (
	"github.com/mozillazg/go-pinyin"
	"go.mongodb.org/mongo-driver/bson/primitive"
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

// PinYinToString convert pinyin to string.
func PinYinToString(obj interface{}) string {
	result := ""
	switch elem := obj.(type) {
	case primitive.A:
		for _, item := range elem {
			result += item.(string)
		}
	case string:
		result = obj.(string)
	}
	return result
}

// PinYinModel 返回拼音模型
type PinYinModel struct {
	// TotalPinYin 全拼
	TotalPinYin []string
	// FirstPinYin 首拼
	FirstPinYin []string
}
