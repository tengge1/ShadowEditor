package main

import (
	"archive/zip"
	"fmt"
	"io/ioutil"
	"os"
)

func main() {
	loadData()
	fmt.Println("Done!")
}

func loadData() (xTrain, yTrain, xTest, yTest []byte) {
	home, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	path := home + "/.keras/datasets/mnist.npz"
	reader, err := zip.OpenReader(path)
	if err != nil {
		panic(err)
	}
	defer reader.Close()

	for _, file := range reader.File {
		reader1, err := file.Open()
		if err != nil {
			panic(err)
		}
		defer reader1.Close()

		switch file.Name {
		default:
			panic("unknown file name: " + file.Name)
		case "x_train.npy":
			xTrain, err = ioutil.ReadAll(reader1)
		case "y_train.npy":
			yTrain, err = ioutil.ReadAll(reader1)
		case "x_test.npy":
			xTest, err = ioutil.ReadAll(reader1)
		case "y_test.npy":
			yTest, err = ioutil.ReadAll(reader1)
		}
		if err != nil {
			panic(err)
		}
	}
	return
}
