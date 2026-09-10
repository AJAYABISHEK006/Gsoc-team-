table = [None] * 10

def hash_function(key):
    return key % 10

numbers = [25, 42, 73]

for number in numbers:
    index = hash_function(number)
    table[index] = number

print(table)