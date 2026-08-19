def login(user):
    return f"{user['name']} has logged in"

def view_tasks(user):
    return f"{user['name']} can view the assigned tasks."

def submit_task(user):
    if user['role'] == "Team Member":
        return f"{user['name']} has submitted the task."
    else:
        return f"Only Team Members can submit tasks."

def assign_task(user):
    if user['role'] == "Project Manager":
        return f"{user['name']} has assigned the task."
    else:
        return f"Only Project Managers can assign tasks."

name = "Stacy"
role = "Team Member"
user = {"name": name, "role": role}
print(login(user))
print(view_tasks(user))
print(submit_task(user))
print(assign_task(user))

name = "Bob"
role = "Project Manager"
user = {"name": name, "role": role}
print(login(user))
print(view_tasks(user))
print(submit_task(user))
print(assign_task(user))

    
    