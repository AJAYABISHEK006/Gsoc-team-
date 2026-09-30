class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        find=set()
        for i in nums:
            if i in find:
                return True
            find.add(i)
        return False