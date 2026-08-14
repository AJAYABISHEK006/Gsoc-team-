class Solution(object):
    def removeDuplicates(self, nums):

        if len(nums) == 0:
            return 0

        slow = 0

        for fast in range(1, len(nums)):

            if nums[fast] != nums[slow]:
                slow += 1
                nums[slow] = nums[fast]

        return slow + 1
nums = list(map(int, input("Enter sorted numbers: ").split()))
obj = Solution()
k = obj.removeDuplicates(nums)
print("Number of unique elements:", k)
print("Array after removing duplicates:", nums[:k])