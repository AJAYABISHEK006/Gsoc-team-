def array_sum(arr, left, right):

    # Base case
    if left == right:
        return arr[left]

    # Find middle
    mid = (left + right) // 2

    # Find sum of left half
    left_sum = array_sum(arr, left, mid)

    # Find sum of right half
    right_sum = array_sum(arr, mid + 1, right)

    # Combine both sums
    return left_sum + right_sum