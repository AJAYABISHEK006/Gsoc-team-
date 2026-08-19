import withoutoops as wop

class User:
    def __init__(self, name, role):
        self.name = name
        self.role = role

    def login(self):
        return f"{self.name} has logged in"

    def view_tasks(self):
        return f"{self.name} can view the assigned tasks."

    def submit_task(self):
        if self.role == "Team Member":
            return f"{self.name} has submitted the task."
        else:
            return f"Only Team Members can submit tasks."

    def assign_task(self):
        if self.role == "Project Manager":
            return f"{self.name} has assigned the task."
        else:
            return f"Only Project Managers can assign tasks."

class Member(User):
    def __init__(self, name, role):
        super().__init__(name, role)

class Manager(User):
    def __init__(self, name, role):
        super().__init__(name, role)



name = "Stacy"
role = "Team Member"
user = {"name": name, "role": role}
print(wop.login(user))
print(wop.view_tasks(user))
print(wop.submit_task(user))
print(wop.assign_task(user))

name = "Bob"
role = "Project Manager"
user = {"name": name, "role": role}
print(wop.login(user))
print(wop.view_tasks(user))
print(wop.submit_task(user))
print(wop.assign_task(user))
