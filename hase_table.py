class HashTable:

    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]
        self.count = 0


    def hash_function(self, key):
        return hash(key) % self.size

   
    def insert(self, key, value):

        index = self.hash_function(key)

        bucket = self.table[index]

    
        for i, (existing_key, existing_value) in enumerate(bucket):

            if existing_key == key:

                bucket[i] = (key, value)

                print(f"Updated: {key} → {value}")

                return

      
        bucket.append((key, value))

        self.count += 1

        print(f"Inserted: {key} → {value}")

    def get(self, key):

        index = self.hash_function(key)

        bucket = self.table[index]

        for existing_key, value in bucket:

            if existing_key == key:
                return value

        return None


    def delete(self, key):

        index = self.hash_function(key)

        bucket = self.table[index]

        for i, (existing_key, value) in enumerate(bucket):

            if existing_key == key:

                del bucket[i]

                self.count -= 1

                print(f"Deleted: {key}")

                return True

        print("Key not found")

        return False


    def contains(self, key):

        return self.get(key) is not None

  
    def load_factor(self):

        return self.count / self.size

 
    def display(self):

        print("\nHash Table:")

        for i, bucket in enumerate(self.table):

            print(f"Index {i}: {bucket}")




ht = HashTable(5)


ht.insert("name", "Dhanashankar")
ht.insert("age", 20)
ht.insert("course", "AI & ML")
ht.insert("city", "Ambur")


ht.insert("age", 21)


print("\nSearch:")
print("Name:", ht.get("name"))
print("Age:", ht.get("age"))

print("\nContains city:", ht.contains("city"))


print("\nLoad Factor:", ht.load_factor())

ht.delete("city")

ht.display()