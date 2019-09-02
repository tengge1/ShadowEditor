for i in [1, 2, 3]:
    print(i)

for i in (4, 5, 6):
    print(i)

for i in {'a': 1, 'b': '2'}:
    print(i)

a = iter('111')
print(next(a))
print(next(a))
print(next(a))


class Reverse:
    def __init__(self, data):
        self.data = data
        self.index = len(data)

    def __iter__(self):
        return self

    def __next__(self):
        if self.index == 0:
            raise StopIteration
        self.index = self.index - 1
        return self.data[self.index]


rev = Reverse('spam')
print(iter(rev))

for char in rev:
    print(char)


def reverse(data):
    for index in range(len(data) - 1, -1, -1):
        yield data[index]


for char in reverse('golf'):
    print(char)
