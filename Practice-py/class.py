class Employee:
    def __init__(self,name):
        self.name=name
    def login(self):
        return f"{self.name} has logged in."
    def view_tasks(self):
        return f"{self.name} can view assigned tasks."
class TeamMember(Employee):
    def submit_task(self):
        return f"{self.name} can submit the task."
class Manager(Employee):
    def assign_task(self):
        return f"{self.name} can assign a new task."
john=TeamMember("John")
alice=Manager("Alice")
print(john.login())
print(john.submit_task())
print(alice.login())
print(alice.assign_task())
