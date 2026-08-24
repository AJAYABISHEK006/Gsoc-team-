from collections import deque


class Deque:
    def __init__(self):
        self.items = deque()


    def insert_front(self, item):
        self.items.appendleft(item)

  
    def insert_rear(self, item):
        self.items.append(item)


    def delete_front(self):
        if self.is_empty():
            return "Deque is empty"

        return self.items.popleft()

    def delete_rear(self):
        if self.is_empty():
            return "Deque is empty"

        return self.items.pop()

   
    def display(self):
        print("Deque:", list(self.items))

   
    def is_empty(self):
        return len(self.items) == 0



my_deque = Deque()


my_deque.insert_rear(10)
my_deque.insert_rear(20)
my_deque.insert_front(5)
my_deque.insert_front(1)


my_deque.display()


print("Deleted from front:", my_deque.delete_front())


print("Deleted from rear:", my_deque.delete_rear())


my_deque.display()