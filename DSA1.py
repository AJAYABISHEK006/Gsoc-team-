
n=int(input())
arr=[]

for i in range(n):
    val=int(input())
    arr.append(val)
print(arr)

minval=arr[0]

for j in arr:
    if j <  minval:
        minval=j
print(minval)

# to find max value
maxval=arr[0]
for j in arr:
    if j > maxval:
        maxval=j
print(maxval)    

# find the sum of array
sumval=0
for j in arr:
    sumval=sumval+j
print(sumval)    

#to find the average of the array

avg=sumval/len(arr)
print(avg)    

