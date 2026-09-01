class Stack:
    def __init__(self, capacity=5):
        self.stack = [None] * capacity
        self.capacity = capacity
        self.top = -1

    def isEmpty(self):
        return self.top == -1

    def isFull(self):
        return self.top == self.capacity - 1

    def push(self, value):
        if self.isFull():
            print("Stack Overflow")          # condition: top == capacity-1
            return
        self.top += 1
        self.stack[self.top] = value
        print(f"Pushed {value}")

    def pop(self):
        if self.isEmpty():
            print("Stack Underflow")         # condition: top == -1
            return None
        value = self.stack[self.top]
        self.top -= 1
        print(f"Popped {value}")
        return value

    def peek(self):
        if self.isEmpty():
            return None
        return self.stack[self.top]


s = Stack(3)
s.push(10)   # Pushed 10
s.push(20)   # Pushed 20
s.push(30)   # Pushed 30
s.push(40)   # Stack Overflow (capacity full)
s.pop()      # Popped 30
print(s.peek())  # 20