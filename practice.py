numbers = [17, 42, 9, 64, 31, 88, 23, 51, 76, 15, 93, 28]
found = False

for i in range(len(numbers)):
    if numbers[i] == 88:
        print(i)
        found = True
        break

if not found:
    print("Not Found")

#https://github.com/AJAYABISHEK006/Gsoc-team-


