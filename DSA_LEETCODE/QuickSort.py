def quick_sort(arr):
    # Base condition
    if len(arr) <= 1:
        return arr

    # Select the last element as pivot
    pivot = arr[-1]

    # Elements smaller than or equal to pivot
    left = []

    # Elements greater than pivot
    right = []

    # Compare each element with pivot
    for i in range(len(arr) - 1):
        if arr[i] <= pivot:
            left.append(arr[i])
        else:
            right.append(arr[i])

    # Recursively sort left and right parts
    return quick_sort(left) + [pivot] + quick_sort(right)


# Get input from user
numbers = input("Enter numbers separated by spaces: ")

# Convert input into a list of integers
arr = list(map(int, numbers.split()))

# Display original array
print("Original array:", arr)

# Sort the array
sorted_arr = quick_sort(arr)

# Display sorted array
print("Sorted array:", sorted_arr)