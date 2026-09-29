class Solution(object):
    def isPalindrome(self, x):
        # Negative numbers are never palindromes
        # Numbers ending in 0 are not palindromes unless the number is 0
        if x < 0 or (x % 10 == 0 and x != 0):
            return False

        reversed_half = 0

        # Reverse only half of the number
        while x > reversed_half:
            reversed_half = reversed_half * 10 + x % 10
            x //= 10

        # Even digits: x == reversed_half
        # Odd digits: ignore the middle digit
        return x == reversed_half or x == reversed_half // 10