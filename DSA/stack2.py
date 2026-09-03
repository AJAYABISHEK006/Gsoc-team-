stack = []

text = input("Enter a string: ")

for ch in text:
    stack.append(ch)

reverse = ""

while stack:
    reverse += stack.pop()

print("Reversed string:", reverse)