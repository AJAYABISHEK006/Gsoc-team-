class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1

def right_rotate(y):
    x = y.left
    temp = x.right

    x.right = y
    y.left = temp

    return x

root = Node(30)
root.left = Node(20)
root.left.left = Node(10)

root = right_rotate(root)

print(root.key)