table = [[] for _ in range(10)]

def hash_function(key):
    return key % 10

numbers = [25, 35, 42]

for number in numbers:
    index = hash_function(number)
    table[index].append(number)

print(table)