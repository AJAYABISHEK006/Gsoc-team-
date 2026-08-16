class Student:
    def __init__(self, name):
        self.name = name

    def display(self):
        print("Student name:", self.name)

student1 = Student("Dharshni")
student1.display()