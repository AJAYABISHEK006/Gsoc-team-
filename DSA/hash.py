table = [None] * 10

def hash_function(key):
    return key % 10

key = 25

index = hash_function(key)

table[index] = key

print(table)