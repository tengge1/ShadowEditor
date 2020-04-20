package server

// Result present a handle result
type Result struct {
	// 200 - ok; 300 -error
	Code int         `json:"Code" bson:"Code"`
	Msg  string      `json:"Msg" bson:"Msg"`
	Data interface{} `json:"Data,omitempty" bson:"Data,omitempty"`
}
