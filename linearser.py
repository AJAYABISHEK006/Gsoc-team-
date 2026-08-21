def linear_search(arr,tar):
    for i in range(len(arr)):
        if(arr[i]==tar):
            return i
    else:
        print("Element not found !")
    return -i
arr=[]
n=int(input("Enter the n : " ))
for i in range (n):
    num=int(input("Enter the element : "))
    arr.append(num)
print(arr)
tar=int(input("Enter the searching element : "))
print(linear_search(arr,tar))    