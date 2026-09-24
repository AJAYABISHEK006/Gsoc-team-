def next_greater(arr):
    stack = []
    result = [-1] * len(arr)

    for i in range(len(arr) - 1, -1, -1):

        while stack and stack[-1] <= arr[i]:
            stack.pop()

        if stack:
            result[i] = stack[-1]

        stack.append(arr[i])

    return result


arr = list(map(int, input("Enter elements: ").split()))

print("Next Greater Elements:", next_greater(arr))