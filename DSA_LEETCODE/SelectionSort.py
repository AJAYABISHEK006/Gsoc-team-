from typing import List

class Solution:
    def sortArray(self, nums: List[int]) -> List[int]:
        n = len(nums)

        for i in range(n - 1):
            min_index = i

            # Find the smallest element in the unsorted part
            for j in range(i + 1, n):
                if nums[j] < nums[min_index]:
                    min_index = j

            # Swap the smallest element with the first element
            # of the unsorted part
            nums[i], nums[min_index] = nums[min_index], nums[i]

        return nums