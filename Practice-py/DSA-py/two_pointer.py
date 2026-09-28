arr = list(map(int, input("Enter elements: ").split()))
target = int(input("Enter target: "))

arr.sort()

left = 0
right = len(arr) - 1

found = False

while left < right:
    total = arr[left] + arr[right]

    if total == target:
        print("Pair found:", arr[left], arr[right])
        found = True
        break
    elif total < target:
        left += 1
    else:
        right -= 1

if not found:
    print("No pair found")