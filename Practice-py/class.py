def login(user_data):
    print(f"{user_data['name']} has logged in")
def view_task(user_data):
    print(f"{user_data['name']} is viewing tasks")
def submit_task(user_data):
    if user_data['role']=="team_member":
        print(f"{user_data['name']} has submitted the work")
    else:
        print("Managers need not submit work")
def assign_task(user_data):
    if user_data['role']=="manager":
            print(f"{user_data['name']} has assigned task")
    else:
        print("Team members cannot assign task")
user_data = {"name":"aishu","role":"manager"}
login(user_data)
