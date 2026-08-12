class a():
    def __init__(self):
        print("Heyyyyyyyyyy")
    def display(self):
        print("Welcome to class A")
class b():
    def __init__(self):
        #super().__init__()
        print("Hello")
    def display(self):
        print("Welcome to class B")
class c(b,a):
    def __init__(self):
        super().display()
        #print("Hi")
    def display(self):
        print("Welcome to class C")
#obj=a()
#obj=b()
obj=c()