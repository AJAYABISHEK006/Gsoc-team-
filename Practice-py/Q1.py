class Shape():
    def area(self):
        return 0
class Rectangle(Shape):
    def __init__(self, length, breadth):
        self.length = length
        self.breadth = breadth
    def area(self):
        return self.length * self.breadth
r1=Rectangle(5,5)
print(r1.area())