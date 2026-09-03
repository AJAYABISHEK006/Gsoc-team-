class ListADT:
    def __init__(self, capacity):
        self.capacity = capacity
        self.array = [None] * capacity
        self.size = 0

    def insert(self, position, value):
        if self.size == self.capacity:
            print("List Overflow")
            return

        if position < 0 or position > self.size:
            print("Invalid position")
            return

        # Shift elements to the right
        for i in range(self.size, position, -1):
            self.array[i] = self.array[i - 1]

        self.array[position] = value
        self.size += 1

    def delete(self, position):
        if self.size == 0:
            print("List is empty")
            return

        if position < 0 or position >= self.size:
            print("Invalid position")
            return

        # Shift elements to the left
        for i in range(position, self.size - 1):
            self.array[i] = self.array[i + 1]

        self.array[self.size - 1] = None
        self.size -= 1

    def search(self, value):
        for i in range(self.size):
            if self.array[i] == value:
                return i
        return "Element Not Found"

    def display(self):
        print(self.array[:self.size])


# Example
lst = ListADT(10)

lst.insert(0, 10)
lst.insert(1, 20)
lst.insert(2, 30)
lst.insert(1, 15)

print("List:")
lst.display()
print("Position of 30:", lst.search(30))
print("After update:")
lst.display()
lst.delete(1)
print("After deletion:")
lst.display()