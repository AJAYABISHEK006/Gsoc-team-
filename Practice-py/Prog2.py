# Node class
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


# Linked List class
class LinkedList:
    def __init__(self):
        self.head = None

    # Insert at beginning
    def insert_beginning(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    # Insert at end
    def insert_end(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = new_node
            return

        temp = self.head
        while temp.next:
            temp = temp.next

        temp.next = new_node

    # Delete a node
    def delete(self, key):
        temp = self.head

        # If head node contains the key
        if temp and temp.data == key:
            self.head = temp.next
            return

        prev = None
        while temp and temp.data != key:
            prev = temp
            temp = temp.next

        if temp is None:
            print("Element not found")
            return

        prev.next = temp.next

    # Search for a node
    def search(self, key):
        temp = self.head
        position = 1

        while temp:
            if temp.data == key:
                print(f"{key} found at position {position}")
                return
            temp = temp.next
            position += 1

        print("Element not found")

    # Display the linked list
    def display(self):
        if self.head is None:
            print("Linked List is Empty")
            return

        temp = self.head
        while temp:
            print(temp.data, end=" -> ")
            temp = temp.next
        print("None")


# Main Program
ll = LinkedList()

while True:
    print("\n----- Singly Linked List -----")
    print("1. Insert at Beginning")
    print("2. Insert at End")
    print("3. Delete")
    print("4. Search")
    print("5. Display")
    print("6. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        value = int(input("Enter value: "))
        ll.insert_beginning(value)

    elif choice == 2:
        value = int(input("Enter value: "))
        ll.insert_end(value)

    elif choice == 3:
        value = int(input("Enter value to delete: "))
        ll.delete(value)

    elif choice == 4:
        value = int(input("Enter value to search: "))
        ll.search(value)

    elif choice == 5:
        ll.display()

    elif choice == 6:
        print("Program Exited")
        break

    else:
        print("Invalid Choice")