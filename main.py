students={}
for i in range(5):
    roll=int(input())
    name=input()
    age=int(input())
    students[roll]={'Name':name,'Age':age}
print("\nStudent Details:")
for roll,details in students.items():
    print(f"Roll: {roll},Name:{details['Name']}, Age: {details['Age']}")
roll_numbers=list(students.keys())
print("All Roll Numbers:",roll_numbers)
names=[details['Name']for details in students.values()]
print("All Names:", names)
roll_to_search = int(input())
if roll_to_search in students:
    print(f"Details - Roll:{roll_to_search},Name:{students [roll_to_search]['Name']},Age:{students[roll_to_search]['Age']}")
else:
    print("Roll number not found.")
    