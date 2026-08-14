class Solution(object):
    def intToRoman(self, num):
        """
        :type num: int
        :rtype: str
        """
        # Store the mappings of integer values to Roman symbols,
        # ordered from largest to smallest, including subtractive forms.
        val_to_roman = [
            (1000, "M"),
            (900, "CM"),
            (500, "D"),
            (400, "CD"),
            (100, "C"),
            (90, "XC"),
            (50, "L"),
            (40, "XL"),
            (10, "X"),
            (9, "IX"),
            (5, "V"),
            (4, "IV"),
            (1, "I")
        ]
        
        roman_numeral = []
        
        # Iterate through the mappings
        for value, symbol in val_to_roman:
            # If the remaining number is 0, we are done
            if num == 0:
                break
            
            # Find how many times the current value fits into num
            count = num // value
            if count > 0:
                # Append the symbol that many times to the result
                roman_numeral.append(symbol * count)
                # Subtract the accounted value from num
                num -= value * count
                
        # Join the list of strings into a single final string
        return "".join(roman_numeral)