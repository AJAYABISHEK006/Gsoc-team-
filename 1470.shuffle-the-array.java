class Solution {
    public int[] shuffle(int[] nums, int n) {
        int[] ans = new int[2*n];
        for(int i = 0,j = 0 ; j < n ; i++,j++)
        {
            ans[i] = nums[j];
            
            ans[++i] = nums[j + n ];
        }
        return ans;
    }
}