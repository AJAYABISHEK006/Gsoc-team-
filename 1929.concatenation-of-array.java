class Solution {
    public int[] getConcatenation(int[] nums) {
       
        int len = nums.length;
        int[] ans = new int[2*len];
        for(int i =0;i < 2 * len ;i++)
        {
            if (i > len - 1)
            {
                ans[i] = nums[i - len];
            }
            else ans[i] = nums[i];
        }
        return ans;
    }
}