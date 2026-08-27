class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.__salary = salary  
    def show_details(self):
        print("Name:", self.name)
        print("Salary:", self.__salary)

    def increase_salary(self, amount):
        if amount > 0:
            self.__salary += amount
            print("Salary increased successfully")
        else:
            print("Invalid amount")

    def get_salary(self):
        return self.__salary


emp = Employee("Rahul", 30000)

emp.show_details()

emp.increase_salary(5000)

print("Updated Salary:", emp.get_salary())