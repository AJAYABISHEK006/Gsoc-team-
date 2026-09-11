class Solution:
    def largest(self, arr):
        n=len(arr)
        large=0
        for i in arr:
            if(i>large):
                large=i
        return large
arr=list(map(int,input("Enter the value : ").split()))  
#obj=Solution() 
#print(obj.largest(arr))
obj = Solution()
print(obj.largest(arr))