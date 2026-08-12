# Definition for singly-linked list.
from typing import List, Optional
class ListNode:
     def __init__(self, val=0, next=None):
         self.val = val
         self.next = next
class Solution:
    def insertionSortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        dummy=ListNode(0,head)
        prev,cur=head,head.next
        while cur:
            if cur.val>=prev.val:
                prev,cur=cur,cur.next
                continue
            tmp = dummy
            while cur.val>tmp.next.val:
                tmp = tmp.next
            prev.next = cur.next
            cur.next = tmp.next
            tmp.next = cur
            cur = prev.next
        return dummy.next 