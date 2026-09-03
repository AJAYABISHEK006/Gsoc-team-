class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


def create_linked_list():
    n = int(input("Enter number of nodes: "))

    head = None
    tail = None

    for i in range(n):
        data = int(input(f"Enter data for node {i + 1}: "))
        new_node = Node(data)

        if head is None:
            head = new_node
            tail = new_node
        else:
            tail.next = new_node
            tail = new_node

    return head


def display(head):
    current = head

    while current:
        print(current.data, end=" -> ")
        current = current.next

    print("None")


def reverse_linked_list(head):
    prev = None
    current = head

    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node

    return prev


# Main program
head = create_linked_list()

print("\nOriginal linked list:")
display(head)

head = reverse_linked_list(head)

print("Reversed linked list:")
display(head)