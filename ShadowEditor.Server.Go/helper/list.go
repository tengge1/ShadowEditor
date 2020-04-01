package helper

// FilterFunc is a filter whether is true
type FilterFunc func(interface{}) bool

// IndexOf find index of an item in a list
func IndexOf(list []interface{}, item interface{}, startIndex int) (index int) {
	index = -1
	for i, n := range list {
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
func LastIndexOf(list []interface{}, item interface{}, lastIndex int) (index int) {
	index = -1
	for i := len(list) - lastIndex - 1; i >= 0; i-- {
		if item == list[i] {
			index = i
			break
		}
	}
	return index
}

// Find find a val through a filter
func Find(list []interface{}, filter FilterFunc) (item *interface{}) {
	for _, n := range list {
		if filter(n) {
			item = &n
			break
		}
	}
	return
}

// FindLast find a val through a filter from last
func FindLast(list []interface{}, filter FilterFunc) (item *interface{}) {
	for i := len(list) - 1; i >= 0; i-- {
		n := list[i]
		if filter(n) {
			item = &n
			break
		}
	}
	return
}

// FindAll find all val through a filter
func FindAll(list []interface{}, filter FilterFunc) (result []interface{}) {
	for _, n := range list {
		if filter(n) {
			result = append(result, n)
		}
	}
	return
}

// FindIndex find index through a filter
func FindIndex(list []interface{}, filter FilterFunc) (index int) {
	for i, n := range list {
		if filter(n) {
			index = i
			break
		}
	}
	return
}

// FindLastIndex find last index through a filter from last
func FindLastIndex(list []interface{}, filter FilterFunc) (index int) {
	for i := len(list) - 1; i >= 0; i-- {
		if filter(list[i]) {
			index = i
			break
		}
	}
	return
}
