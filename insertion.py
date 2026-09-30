class Solution:
    def intersection(self, nums1: list[int], nums2: list[int]) -> list[int]:
        set1  = set(nums1)
        set2 =  set(nums2)
        return list(set1 & set2)  
nums1=[1,2,2,1]
nums2=[2,2]
print(Solution().intersection(nums1,nums2))      