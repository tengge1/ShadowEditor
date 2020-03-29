package base

// Result present a handle result
type Result struct {
	// 200 - ok; 300 -error
	Code int
	Msg  string
	Data interface{} `json:"Data,omitempty"`
}
