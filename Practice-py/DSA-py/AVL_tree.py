class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None
        self.height = 1


# Find height
def height(node):
    if node is None:
        return 0
    return node.height


# Find balance factor
def balance(node):
    if node is None:
        return 0
    return height(node.left) - height(node.right)


# Right rotation
def right_rotate(y):
    print("Tree is unbalanced -> Right Rotation")

    x = y.left
    t = x.right

    x.right = y
    y.left = t

    y.height = 1 + max(height(y.left), height(y.right))
    x.height = 1 + max(height(x.left), height(x.right))

    return x


# Left rotation
def left_rotate(x):
    print("Tree is unbalanced -> Left Rotation")

    y = x.right
    t = y.left

    y.left = x
    x.right = t

    x.height = 1 + max(height(x.left), height(x.right))
    y.height = 1 + max(height(y.left), height(y.right))

    return y


# Insert a node
def insert(root, data):

    # Normal BST insertion
    if root is None:
        return Node(data)

    if data < root.data:
        root.left = insert(root.left, data)

    elif data > root.data:
        root.right = insert(root.right, data)

    else:
        return root

    # Update height
    root.height = 1 + max(height(root.left), height(root.right))

    # Find balance factor
    b = balance(root)

    # LL case
    if b > 1 and data < root.left.data:
        return right_rotate(root)

    # RR case
    if b < -1 and data > root.right.data:
        return left_rotate(root)

    # LR case
    if b > 1 and data > root.left.data:
        print("Tree is unbalanced -> Left-Right Rotation")
        root.left = left_rotate(root.left)
        return right_rotate(root)

    # RL case
    if b < -1 and data < root.right.data:
        print("Tree is unbalanced -> Right-Left Rotation")
        root.right = right_rotate(root.right)
        return left_rotate(root)

    return root


# Inorder traversal
def inorder(root):
    if root:
        inorder(root.left)
        print(root.data, end=" ")
        inorder(root.right)


# Main program
root = None

n = int(input("Enter number of nodes: "))

for i in range(n):
    data = int(input("Enter value: "))
    root = insert(root, data)

print("\nInorder Traversal:")
inorder(root)
