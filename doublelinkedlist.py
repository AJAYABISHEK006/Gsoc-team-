class Node:
    def __init__(self, data):
        self.data = data
        self.prev = None
        self.next = None


class DoublyLinkedList:
    def __init__(self):
        self.head = None

    # Insert at end
    def insert(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = new_node
            return

        temp = self.head

        while temp.next:
            temp = temp.next

        temp.next = new_node
        new_node.prev = temp

    # Delete a node
    def delete(self, data):
        temp = self.head

        while temp:
            if temp.data == data:

                # If deleting head
                if temp.prev is None:
                    self.head = temp.next

                    if self.head:
                        self.head.prev = None

                else:
                    temp.prev.next = temp.next

                    if temp.next:
                        temp.next.prev = temp.prev

                return

            temp = temp.next

    # Display forward
    def display_forward(self):
        temp = self.head

        while temp:
            print(temp.data, end=" <-> ")
            temp = temp.next

        print("None")

    # Display backward
    def display_backward(self):
        if self.head is None:
            return

        temp = self.head

        while temp.next:
            temp = temp.next

        while temp:
            print(temp.data, end=" <-> ")
            temp = temp.prev

        print("None")


# Example
list2 = DoublyLinkedList()

list2.insert(10)
list2.insert(20)
list2.insert(30)

print("Doubly Linked List:")
list2.display_forward()

print("Reverse:")
list2.display_backward()

list2.delete(20)

print("After deletion:")
list2.display_forward()