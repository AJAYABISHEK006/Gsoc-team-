class Solution(object):
    def romanToInt(self, s):
        """
        :type s: str
        :rtype: int
        """
        # Dictionary to store the values of each Roman numeral symbol
        roman_map = {
            'I': 1, 'V': 5, 'X': 10, 'L': 50, 
            'C': 100, 'D': 500, 'M': 1000
        }
        
        total = 0
        n = len(s)
        
        # Iterate through the characters in the string
        for i in range(n):
            # If the current symbol's value is less than the next symbol's value,
            # we subtract it from the total (e.g., IV, IX).
            if i < n - 1 and roman_map[s[i]] < roman_map[s[i+1]]:
                total -= roman_map[s[i]]
            # Otherwise, we add it to the total.
            else:
                total += roman_map[s[i]]
                
        return total