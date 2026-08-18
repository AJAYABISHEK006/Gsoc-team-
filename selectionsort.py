#n = int(input("enter the no of elements:"))
#arr = {}
#for i in range(0,n):
 #   m = int(input("enter the element"))
  #  arr.append(m)
def selectionsort(arr):
 n = len(arr)
 for i in range(n):
     index = i
     for j in range(i+1,n):
        if arr[j]< arr[index]:
            index = j
     arr[index],arr[i] = arr[i],arr[index]
 return(arr)
print(selectionsort([2,5,4,1]))
