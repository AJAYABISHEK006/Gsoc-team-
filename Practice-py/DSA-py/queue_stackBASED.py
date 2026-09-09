stack1 = []
stack2 = []


def enqueue(value):
    stack1.append(value)
    print(value, "inserted into queue")


def dequeue():
    if len(stack1) == 0 and len(stack2) == 0:
        print("Queue is empty")
        return

    if len(stack2) == 0:
        while len(stack1) > 0:
            stack2.append(stack1.pop())

    value = stack2.pop()
    print(value, "removed from queue")


def display():
    if len(stack1) == 0 and len(stack2) == 0:
        print("Queue is empty")
        return

    print("Queue elements:", end=" ")

    for i in range(len(stack2) - 1, -1, -1):
        print(stack2[i], end=" ")

    for i in range(len(stack1)):
        print(stack1[i], end=" ")

    print()


while True:
    print("\n1. Enqueue")
    print("2. Dequeue")
    print("3. Display")
    print("4. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        value = int(input("Enter the element to insert: "))
        enqueue(value)

    elif choice == 2:
        dequeue()

    elif choice == 3:
        display()

    elif choice == 4:
        print("Program ended")
        break

    else:
        print("Invalid choice")