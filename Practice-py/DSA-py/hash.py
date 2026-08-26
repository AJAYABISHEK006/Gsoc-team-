hash_table = {}

while True:
    print("\n--- HASH TABLE ---")
    print("1. Insert")
    print("2. Search")
    print("3. Delete")
    print("4. Display")
    print("5. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        key = int(input("Enter key: "))
        value = input("Enter value: ")

        hash_table[key] = value

        print("Inserted successfully.")

    elif choice == 2:
        key = int(input("Enter key to search: "))

        if key in hash_table:
            print("Value:", hash_table[key])
        else:
            print("Key not found.")

    elif choice == 3:
        key = int(input("Enter key to delete: "))

        if key in hash_table:
            del hash_table[key]
            print("Deleted successfully.")
        else:
            print("Key not found.")

    elif choice == 4:
        print("Hash Table:")

        for key, value in hash_table.items():
            print(key, "->", value)

    elif choice == 5:
        break

    else:
        print("Invalid choice.")