# Create a Node
class Node:
    def __init__(self, data):
        self.data = data
        self.left = None
        self.right = None


# Preorder Traversal: Root → Left → Right
def preorder(root):
    if root:
        print(root.data, end=" ")
        preorder(root.left)
        preorder(root.right)


# Inorder Traversal: Left → Root → Right
def inorder(root):
    if root:
        inorder(root.left)
        print(root.data, end=" ")
        inorder(root.right)


# Postorder Traversal: Left → Right → Root
def postorder(root):
    if root:
        postorder(root.left)
        postorder(root.right)
        print(root.data, end=" ")


# Create the binary tree
root = Node('F')

root.left, root.right = Node('B'), Node('G')

root.left.left, root.left.right = Node('A'), Node('D')

root.left.right.left, root.left.right.right = Node('C'), Node('E')

root.right.right = Node('J')

root.right.right.left = Node('H')


# Traversals
print("Preorder:")
preorder(root)
print()

print("Inorder:")
inorder(root)
print()

print("Postorder:")
postorder(root)
print()