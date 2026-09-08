class Solution:
    def isPalindrome(self, x: int) -> bool:
        s = str(x)
        left = 0
        right = len(s) - 1
        check = True
    
        while (left < right):
            if(s[left] != s[right]):
                check = False
                break
            left +=1
            right -=1
        return check