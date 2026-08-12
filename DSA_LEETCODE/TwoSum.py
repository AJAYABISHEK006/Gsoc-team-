from typing import List

# Node of Linked List
class Node:
    def __init__(self, value, index):
        self.value = value      # Stores array value
        self.index = index      # Stores original index
        self.next = None        # Pointer to next node


class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:

        # Step 1: Convert Array to Linked List
        head = None
        tail = None

        for i in range(len(nums)):
            new_node = Node(nums[i], i)

            if head is None:
                head = new_node
                tail = new_node
            else:
                tail.next = new_node
                tail = new_node

        # Step 2: Traverse the Linked List
        first = head

        while first is not None:

            second = first.next

            while second is not None:

                if first.value + second.value == target:
                    return [first.index, second.index]

                second = second.next

            first = first.next

        return []