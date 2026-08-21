arr=[1,3,4,5,6]
size=5
new_position=2
new_element=8
arr.append(0)
for i in range(size-1,new_position-1,-1):
    arr[i+1] = arr[i]
arr[new_position] = new_element
size+=1
for i in range(size):
    print(arr[i],end=" ")

print()

arra=list(map(int,input("Enter the values : ").split()))
size_1 = len(arra)
new_pos=int(input("Enter the position : "))
new_val=int(input("Enter the new value : "))
arra.append(0)
for i in range(size_1 -1,new_pos-1,-1):
    arra[i+1]=arra[i]
arra[new_pos]=new_val
size_1+=1

print(arra,end=" ")