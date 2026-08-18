#n = int(input("enter the no of elements:"))
#arr = {}
#for i in range(0,n):
 #   m = int(input("enter the element"))
 #   arr.append(m)

def bubblesort(arr):
    n=len(arr)
    
    for i in range(n):
       for j in range(n - i - 1):

        if arr[j] > arr[j + 1]:
            arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return(arr)
print(bubblesort([5,6,1,3,0]))