n=int(input())

arr=[]

for i in range(n):
    val=int(input())
    arr.append(val)
print(arr)    


for i in range(n):
    for j in range(n-i-1):
        if arr[j] > arr[j+1]:
            arr[j], arr[j+1] = arr[j+1], arr[j]
            
print(arr)            