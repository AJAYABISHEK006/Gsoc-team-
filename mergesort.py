def merge_sort (arr):
    if len(arr) <= 1:
        return(arr)
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return(merge(left , right))
def merge (left , right):
    result = []
    i =  0
    j = 0
    while i < len(left) and j < len(right):
        if (left[i] < right[j]) :
            result.append(left[i])
            i+=1
        else:
            result.append(right[j])
            j+=1
    while i< len(left):
        result.append(left[i])
        i+=1
    while j< len(right):
         result.append(right[j])
         j+=1

    return (result)

print(merge_sort([2,5,6,1,8]))
