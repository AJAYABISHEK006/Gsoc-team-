numbers = [25, 67, 12, 89, 45, 34, 78]

largest = numbers[0]

for num in numbers:
    if num > largest:
        largest = num

print("Largest number =", largest)