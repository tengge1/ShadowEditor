package helper

import "fmt"

// FilterFunc is a filter whether is true
type FilterFunc func(interface{}) bool

// IndexOf find index of an item in a list
func IndexOf(list interface{}, item interface{}, startIndex int) (index int, err error) {
	list1, ok := list.([]interface{})
	if !ok {
		return -1, fmt.Errorf("list can not convert to []interface{}")
	}

	index = -1
	for i, n := range list1 {
		if i < startIndex {
			continue
		}
		if n == item {
			index = i
			break
		}
	}
	return
}

// LastIndexOf find last index of an item in a list
func LastIndexOf(list interface{}, item interface{}, lastIndex int) (index int, err error) {
	list1, ok := list.([]interface{})
	if !ok {
		return -1, fmt.Errorf("list can not convert to []interface{}")
	}

	index = -1
	for i := len(list1) - lastIndex - 1; i >= 0; i-- {
		if item == list1[i] {
			index = i
			break
		}
	}
	return index, nil
}

// Find find a val through a filter
func Find(list interface{}, filter FilterFunc) (item *interface{}, err error) {
	list1, ok := list.([]interface{})
	if !ok {
		return nil, fmt.Errorf("list can not convert to []interface{}")
	}

	for _, n := range list1 {
		if filter(n) {
			item = &n
			break
		}
	}
	return
}

// FindLast find a val through a filter from last
func FindLast(list interface{}, filter FilterFunc) (item *interface{}, err error) {
	list1, ok := list.([]interface{})
	if !ok {
		return nil, fmt.Errorf("list can not convert to []interface{}")
	}

	for i := len(list1) - 1; i >= 0; i-- {
		n := list1[i]
		if filter(n) {
			item = &n
			break
		}
	}
	return
}

// FindAll find all val through a filter
func FindAll(list interface{}, filter FilterFunc) (result []interface{}, err error) {
	list1, ok := list.([]interface{})
	if !ok {
		return nil, fmt.Errorf("list can not convert to []interface{}")
	}

	for _, n := range list1 {
		if filter(n) {
			result = append(result, n)
		}
	}
	return
}

// FindIndex find index through a filter
func FindIndex(list interface{}, filter FilterFunc) (index int, err error) {
	list1, ok := list.([]interface{})
	if !ok {
		return -1, fmt.Errorf("list can not convert to []interface{}")
	}

	for i, n := range list1 {
		if filter(n) {
			index = i
			break
		}
	}
	return
}

// FindLastIndex find last index through a filter from last
func FindLastIndex(list interface{}, filter FilterFunc) (index int, err error) {
	list1, ok := list.([]interface{})
	if !ok {
		return -1, fmt.Errorf("list can not convert to []interface{}")
	}

	for i := len(list1) - 1; i >= 0; i-- {
		if filter(list1[i]) {
			index = i
			break
		}
	}
	return
}
