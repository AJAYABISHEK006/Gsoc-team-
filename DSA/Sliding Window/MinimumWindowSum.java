class MinimumWindowSum
{
    public static void main(String[] args)
    {
        int[] arr = {2, 1, 5, 1, 3, 2};
        int k = 3;
        int sumWindow = 0;
        int minWindow = 0;

        for(int i = 0; i < k; i++)
        {
            sumWindow += arr[i];
        }
        minWindow = sumWindow;

        for(int i = k; i < arr.length; i++)
        {
            sumWindow = sumWindow - arr[i - k] + arr[i];

            if(sumWindow < minWindow)
            {
                minWindow = sumWindow;
            }
        }
        System.out.print("Minimum Window Sum : " + minWindow);
    }
}