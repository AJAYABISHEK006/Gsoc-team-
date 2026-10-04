class Solution(object):
    def containsDuplicate(self, nums):
        """
        :type nums: List[int]
        :rtype: bool
        """
        a=[]
        for i in nums:
            if i in a:
                return True
            else:
                a.append(i)
        return False            