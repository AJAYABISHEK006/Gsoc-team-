class MaximumWindowSum
{
    public static void main(String[] args)
    {
        int[] arr = {2, 3, 1, 5, 6, 2};
        int sumWindow = 0;
        int maxWindow = 0;
        int k = 3;

        for(int i = 0; i < k; i++)
        {
            sumWindow += arr[i];
        }
        maxWindow = sumWindow;

        for(int i = k; i < arr.length; i++)
        {
            sumWindow = sumWindow - arr[i - k] + arr[i] ;

            if(sumWindow > maxWindow)
            {
                maxWindow = sumWindow;
            }
        }
        System.out.print("Maximum Window Sum : " + maxWindow);

    }
}