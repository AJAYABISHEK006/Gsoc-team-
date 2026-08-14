class Solution(object):
    def solveNQueens(self, n):
        ans = []

        cols = set()
        diag1 = set()
        diag2 = set()

        board = [["."] * n for _ in range(n)]

        def solve(row):
            if row == n:
                ans.append(["".join(r) for r in board])
                return

            for col in range(n):
                if col in cols or (row - col) in diag1 or (row + col) in diag2:
                    continue

                cols.add(col)
                diag1.add(row - col)
                diag2.add(row + col)
                board[row][col] = "Q"

                solve(row + 1)

                board[row][col] = "."
                cols.remove(col)
                diag1.remove(row - col)
                diag2.remove(row + col)

        solve(0)
        return ans
n = int(input("Enter the number of queens: "))
obj = Solution()
result = obj.solveNQueens(n)
print("\nSolutions:")
for solution in result:
    for row in solution:
        print(row)
    print()