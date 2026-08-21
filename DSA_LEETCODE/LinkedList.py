# Node class
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


# Singly Linked List class
class SinglyLinkedList:
    def __init__(self):
        self.head = None

    # Insert at the beginning
    def insert_begin(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    # Insert at the end
    def insert_end(self, data):
        new_node = Node(data)

        if self.head is None:
            self.head = new_node
            return

        temp = self.head
        while temp.next:
            temp = temp.next

        temp.next = new_node

    # Delete a node by value
    def delete(self, key):
        temp = self.head

        # If head node contains the key
        if temp and temp.data == key:
            self.head = temp.next
            temp = None
            return

        prev = None
        while temp and temp.data != key:
            prev = temp
            temp = temp.next

        if temp is None:
            print("Element not found")
            return

        prev.next = temp.next
        temp = None

    # Search for an element
    def search(self, key):
        temp = self.head
        while temp:
            if temp.data == key:
                return True
            temp = temp.next
        return False

    # Display the linked list
    def display(self):
        temp = self.head
        if temp is None:
            print("Linked List is empty")
            return

        while temp:
            print(temp.data, end=" -> ")
            temp = temp.next
        print("None")


# Driver code
if __name__ == "__main__":
    sll = SinglyLinkedList()
    a=int(input("Enter the first value:"))
    b=int(input("Enter the second value:"))
    c=int(input("Enter the third value:"))
    d=int(input("Enter the beginning value"))
    sll.insert_end(a)
    sll.insert_end(b)
    sll.insert_end(c)
    sll.insert_begin(d)

    print("Linked List:")
    sll.display()
    s=int(input("The searching value is "))
    print("\nSearching for ",s)
    if sll.search(s):
        print("Element found")
    else:
        print("Element not found")

    n = int(input("Enter the deleting number:"))
    if n:

        print("\nDeleting ",n ,"...")
        sll.delete(n)

    print("Linked List after deletion:")
    sll.display()