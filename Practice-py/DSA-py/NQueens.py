class Solution(object):
    def totalNQueens(self, n):
        self.count = 0

        cols = set()
        diag1 = set()
        diag2 = set()

        def solve(row):
            if row == n:
                self.count += 1
                return

            for col in range(n):
                if col in cols or (row-col) in diag1 or (row+col) in diag2:
                    continue

                cols.add(col)
                diag1.add(row-col)
                diag2.add(row+col)

                solve(row + 1)

                cols.remove(col)
                diag1.remove(row-col)
                diag2.remove(row+col)

        solve(0)
        return self.count
n = int(input("Enter the value of n: "))
obj = Solution()
answer = obj.totalNQueens(n)
print("Number of solutions:", answer)    