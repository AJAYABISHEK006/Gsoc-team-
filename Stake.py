class Stack:
    def __init__(self):
        self.items = []

   
    def push(self, item):
        self.items.append(item)
        print(item, "pushed into stack")

    def pop(self):
        if self.is_empty():
            return "Stack is empty"
        return self.items.pop()

    
    def peek(self):
        if self.is_empty():
            return "Stack is empty"
        return self.items[-1]

   
    def display(self):
        print("Stack:", self.items)

    def is_empty(self):
        return len(self.items) == 0

my_stack = Stack()

my_stack.push(10)
my_stack.push(20)
my_stack.push(30)


my_stack.display()


print("Top element:", my_stack.peek())


print("Removed element:", my_stack.pop())

my_stack.display()