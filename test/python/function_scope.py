def scope_test():
    def do_local():
        spam = 'local spam'

    def do_nonlocal():
        nonlocal spam
        spam = 'nonlocal spam'

    def do_global():
        global spam
        spam = 'global spam'

    spam = 'test spam'
    do_local()
    print('local:', spam)
    do_nonlocal()
    print('no_local:', spam)
    do_global()
    print('global:', spam)


scope_test()
print('global scope:', spam)
