
arr=list(map(int,input("Enter the value : ").split()))
size=len(arr)
pos_del=int(input("Enter the poition : "))
for i in range(pos_del,size-1,+1):
    arr[i]=arr[i+1]
size = size - 1
print(arr)
print()

# Initial array
arr = [2, 4, 6, 8, 10]
size = 5  # Current size of the array

position_to_delete = 2  # Index of the element to delete

# Shift elements to fill the gap left by the deleted element

for i in range(position_to_delete,size-1,+1):
    arr[i]=arr[i+1]
#arr.pop(0)

# Update the size of the array
size-=1
# Print the updated array
for i in range(size):
    print(arr[i], end=" ")