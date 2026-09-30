#29-09-2026

class Solution:
    def isPalindrome(self, x: int) -> bool:
        # Negative numbers are never palindromes
        if x < 0:
            return False

        # Store the original number
        original = x

        # This will store the reversed number
        reversed_num = 0

        # Reverse the number digit by digit
        while x > 0:
            digit = x % 10
            reversed_num = reversed_num * 10 + digit
            x = x // 10

        # Compare original and reversed numbers
        return original == reversed_num