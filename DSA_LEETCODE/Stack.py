class Stack:
    def __init__(self, capacity):
        self.capacity = capacity
        self.stack = [None] * capacity
        self.top = -1

    # PUSH operation
    def push(self, value):
        if self.top == self.capacity - 1:
            print("Stack Overflow")
            return

        self.top += 1
        self.stack[self.top] = value
        print(value, "pushed into stack")

    # POP operation
    def pop(self):
        if self.top == -1:
            print("Stack Underflow")
            return None

        value = self.stack[self.top]
        self.stack[self.top] = None
        self.top -= 1

        print(value, "popped from stack")
        return value

    # Display operation
    def display(self):
        if self.top == -1:
            print("Stack is empty")
            return

        print("Stack:", self.stack[:self.top + 1])
        print("Top element:", self.stack[self.top])


# Create stack with capacity 5
s = Stack(5)

# PUSH operations
s.push(10)
s.push(20)
s.push(30)
s.push(40)
s.push(50)

s.display()

# Overflow demonstration
s.push(60)

# POP operations
s.pop()
s.pop()

s.display()

# Pop remaining elements
s.pop()
s.pop()
s.pop()

# Underflow demonstration
s.pop()