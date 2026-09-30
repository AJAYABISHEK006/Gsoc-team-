class Solution:
    def intersection(self, nums1: list[int], nums2: list[int]) -> list[int]:
        set1 = set(nums1)
        set2 = set(nums2)

        result = []

        for num in set1:
            if num in set2:
                result.append(num)

        return result