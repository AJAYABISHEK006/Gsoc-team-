class Solution(object):
    def isValid(self, s):

        stack = []

        pairs = {
            ')': '(',
            '}': '{',
            ']': '['
        }

        for ch in s:

            if ch in "([{":
                stack.append(ch)

            else:
                if not stack or stack[-1] != pairs[ch]:
                    return False

                stack.pop()

        return len(stack) == 0
s = input("Enter brackets: ")
obj = Solution()
result = obj.isValid(s)
print(result)