package main

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
)

func main() {
	set := bson.M{
		"foo": "bar",
	}
	update := bson.M{
		"$set": set,
	}
	set["hello"] = "world"

	result := update["$set"].(bson.M)
	fmt.Println(result["hello"])
}
