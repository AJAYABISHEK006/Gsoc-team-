class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


def bubble_sort(head):
    if head is None:
        return head

    current = head

    while current is not None:
        next_node = current.next

        while next_node is not None:
            if current.data > next_node.data:
                current.data, next_node.data = next_node.data, current.data

            next_node = next_node.next

        current = current.next

    return head


def display(head):
    current = head

    while current is not None:
        print(current.data, end=" ")
        current = current.next

    print()


# User input
values = list(map(int, input("Enter the elements: ").split()))

# Create linked list directly
head = Node(values[0])
current = head

for value in values[1:]:
    current.next = Node(value)
    current = current.next

# Sort the linked list
head = bubble_sort(head)

# Display sorted array/list
print("Sorted array:", end=" ")
display(head)