package context

import "testing"

func TestCreate(t *testing.T) {
	err := Create("../config.toml")
	if err != nil {
		t.Error(err)
		return
	}
	t.Log(Config)
	Logger.Info("Some info from context_test.go")

	mong, err := Mongo()
	if err != nil {
		t.Error(err)
		return
	}

	collectionNames, err := mong.ListCollectionNames()
	if err != nil {
		t.Error(err)
		return
	}

	for _, collectionName := range collectionNames {
		t.Log(collectionName)
	}
}
