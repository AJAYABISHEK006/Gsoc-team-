def binary_search(arr, target):

    low = 0
    high = len(arr) - 1

    while low <= high:

        mid = (low + high) // 2

        if arr[mid] == target:
            return mid

        elif target > arr[mid]:
            low = mid + 1

        else:
            high = mid - 1

    return -1


arr = [10, 20, 30, 40, 50, 60, 70]

target = 50

result = binary_search(arr, target)

if result != -1:
    print("Element found at index:", result)
else:
    print("Element not found")