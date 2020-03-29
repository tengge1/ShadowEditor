package system

// Config mongodb config collection
type Config struct {
	ID                  string
	Initialized         bool
	DefaultRegisterRole string
}
