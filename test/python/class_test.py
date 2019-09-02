class MyClass:
    '''A simple example class'''
    i = 12345

    def __init__(self):
        self.i = 123

    def f(self):
        print(self.i)


class DerivedClass(MyClass):
    pass

x = DerivedClass()
x.f()

x.name = 'Test'

print(x.name)