class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class CircularLinkedList:
    def __init__(self):
        self.head = None

    # Insert at end
    def insert(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = new_node
            new_node.next = self.head
            return

        temp = self.head

        while temp.next != self.head:
            temp = temp.next

        temp.next = new_node
        new_node.next = self.head

    # Delete a node
    def delete(self, data):
        if self.head is None:
            return

        # Only one node
        if self.head.data == data and self.head.next == self.head:
            self.head = None
            return

        # Delete head
        if self.head.data == data:
            temp = self.head

            while temp.next != self.head:
                temp = temp.next

            self.head = self.head.next
            temp.next = self.head
            return

        # Delete other node
        temp = self.head

        while temp.next != self.head:
            if temp.next.data == data:
                temp.next = temp.next.next
                return

            temp = temp.next

    # Display
    def display(self):
        if self.head is None:
            print("Empty List")
            return

        temp = self.head

        while True:
            print(temp.data, end=" -> ")
            temp = temp.next

            if temp == self.head:
                break

        print("(HEAD)")


# Example
list3 = CircularLinkedList()

list3.insert(10)
list3.insert(20)
list3.insert(30)

print("Circular Linked List:")
list3.display()

list3.delete(20)

print("After deletion:")
list3.display()