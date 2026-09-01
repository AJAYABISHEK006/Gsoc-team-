class ListADT:
    def __init__(self, capacity):
        self.array = [None] * capacity
        self.capacity = capacity
        self.size = 0

    # Insert an element at a given position
    def insert(self, position, value):
        if self.size == self.capacity:
            print("List is full")
            return

        if position < 0 or position > self.size:
            print("Invalid position")
            return

        # Shift elements to the right
        for i in range(self.size, position, -1):
            self.array[i] = self.array[i - 1]

        self.array[position] = value
        self.size += 1

    # Delete an element from a given position
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

    # Search for an element
    def search(self, value):
        for i in range(self.size):
            if self.array[i] == value:
                return i
        return -1

    # Get an element
    def get(self, position):
        if position < 0 or position >= self.size:
            return None
        return self.array[position]

    # Update an element
    def update(self, position, value):
        if position < 0 or position >= self.size:
            print("Invalid position")
            return

        self.array[position] = value

    # Display the list
    def display(self):
        print(self.array[:self.size])


# Example
list1 = ListADT(5)

list1.insert(0, 10)
list1.insert(1, 20)
list1.insert(2, 30)
list1.insert(1, 15)

list1.display()

list1.delete(2)
list1.display()

print("Position of 20:", list1.search(20))
print("Element at index 1:", list1.get(1))

list1.update(1, 25)
list1.display()