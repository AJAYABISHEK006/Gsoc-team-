class Solution(object):
    def twoSum(self, nums, target):

        d = {}

        for i in range(len(nums)):

            complement = target - nums[i]

            if complement in d:
                return [d[complement], i]

            d[nums[i]] = i
nums = [2, 7, 11, 15]
target = 9

obj = Solution()
result = obj.twoSum(nums, target)

print(result)