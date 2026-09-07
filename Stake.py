class Stack:
    def __init__(self):
        self.stack = []

    # Push operation
    def push(self, item):
        self.stack.append(item)

    # Pop operation
    def pop(self):
        if len(self.stack) == 0:
            print("Stack is empty")
        else:
            print("Deleted:", self.stack.pop())

    # Peek operation
    def peek(self):
        if len(self.stack) == 0:
            print("Stack is empty")
        else:
            print("Top element:", self.stack[-1])

    # Display operation
    def display(self):
        print("Stack:", self.stack)


# Create stack
s = Stack()

# Push elements
s.push(10)
s.push(20)
s.push(30)

s.display()

# Peek
s.peek()

# Pop
s.pop()

# Display after pop
s.display()