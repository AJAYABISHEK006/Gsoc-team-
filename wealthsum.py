class Solution(object):
    def maximumWealth(self, accounts):
        """
        :type accounts: List[List[int]]
        :rtype: int
        """
        max_wealth=0

        for i in range (len(accounts)):
            wealth=0

            for j in range(len(accounts[i])):
                wealth=wealth+accounts[i][j]

                if wealth > max_wealth:
                    max_wealth=wealth

        return max_wealth                       
