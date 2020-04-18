package category

// Model category model
type Model struct {
	ID   string `bson:"_id"`
	Name string
	Type string
}
