class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class SinglyLinkedList:
    def __init__(self):
        self.head = None

    # Insert at the end
    def insert(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = new_node
            return

        current = self.head

        while current.next is not None:
            current = current.next

        current.next = new_node

    # Delete a value
    def delete(self, data):
        if self.head is None:
            print("List is empty")
            return

        if self.head.data == data:
            self.head = self.head.next
            return

        current = self.head

        while current.next is not None:
            if current.next.data == data:
                current.next = current.next.next
                return
            current = current.next

        print("Element not found")

    # Search for a value
    def search(self, data):
        current = self.head
        position = 0

        while current is not None:
            if current.data == data:
                return position

            current = current.next
            position += 1

        return -1

    # Display the list
    def display(self):
        current = self.head

        while current is not None:
            print(current.data, end=" -> ")
            current = current.next

        print("None")


# Example
list1 = SinglyLinkedList()

list1.insert(10)
list1.insert(20)
list1.insert(30)

list1.display()

list1.insert(15)
list1.display()

list1.delete(20)
list1.display()

print("Position of 30:", list1.search(30))