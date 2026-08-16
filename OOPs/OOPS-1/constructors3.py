class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def display(self):
        print("Employee:", self.name)
        print("Salary:", self.salary)

    def annual_salary(self):
        print("Annual Salary:", self.salary * 12)


emp = Employee("Rahul", 30000)

emp.display()
emp.annual_salary()