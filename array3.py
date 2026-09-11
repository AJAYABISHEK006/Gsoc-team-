class Solution:
    def getMinMax(self, arr):
        min=arr[0]
        max=arr[0]
        for i in arr:
            if(i>max):
                max=i
            elif(i<min):
                min=i
        return [min,max]
arr=list(map(int,input("Enter the values : ").split()))
obj = Solution()
print(obj.getMinMax(arr))