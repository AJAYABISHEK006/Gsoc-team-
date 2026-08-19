def insecrtion_sort(arr):
    for i in range(1,len(arr)):
       index = arr[i]
       j = i-1
       while j>=0 and arr[j] > index :
           arr[j+1] = arr[j]
           j -=1
       arr[j+1] = index
    return (arr)

print(insecrtion_sort([6,7,4,2,1]))
