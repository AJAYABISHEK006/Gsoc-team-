def merge_sort(arr):
    if len(arr) <= 1:
        return arr


    mid = len(arr) // 2
    left = arr[:mid]
    right = arr[mid:]

    left = merge_sort(left)
    right = merge_sort(right)

    return merge(left, right)


def merge(left, right):
    result = []

    while left and right:
        if left[0] < right[0]:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))

    result.extend(left)
    result.extend(right)

    return result


arr = [8, 3, 5, 1, 4, 2]

print("Original array:", arr)
print("Sorted array:", merge_sort(arr))