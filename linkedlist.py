class Node :
  def __init__ (self, data):
         self.data = data
         self.next = None
class linkedlist:
    def __init__(self):
        self.head = None


    def insert(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node
        print("Node inserted successfully")

        
    def delete(self):
        if self.head is None:
            print("List is empty")
        else:
            self.head = self.head.next
            print("Node deleted successfully")


    def traverse(self):
        if self.head is None:
            print("List is empty")
        else:
            temp = self.head
            while temp is not None:
                print(temp.data, end=" -> ")
                temp = temp.next
            print("None")
l=[10,20,30]
l = linkedlist()

while True:
    print("\n--- LINKED LIST ---")
    print("1. Insert")
    print("2. Delete")
    print("3. Traverse")
    print("4. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        data = int(input("Enter data: "))
        l.insert(data)

    elif choice == 2:
        l.delete()

    elif choice == 3:
        l.traverse()

    elif choice == 4:
        break

    else:
        print("Invalid choice")

