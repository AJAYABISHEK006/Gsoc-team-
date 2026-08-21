def binary_search(arr,tar):
    low=0
    high=len(arr)-1
    while(low<=high):
        mid=(low+high)//2
        if(arr[mid]==tar):
            return mid
        elif(arr[mid]<tar):
            low=mid+1
        else:
            high=mid-1
    return -1
arr=[]
n=int(input("Enter the n :"))
for i in range (n):
    num=int(input(f"Enter the value {i+1} :"))
    arr.append(num)
print(arr)
tar=int(input("Enter the finding element :"))
print(binary_search(arr,tar))