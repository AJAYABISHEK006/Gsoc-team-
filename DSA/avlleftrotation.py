class Node:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1


def left_rotate(x):
    y = x.right
    temp = y.left

    y.left = x
    x.right = temp

    return y

root = Node(10)
root.right = Node(20)
root.right.right = Node(30)

root = left_rotate(root)

print(root.key)