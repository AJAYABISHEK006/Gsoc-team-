class MinimumSubarrayLength2
{
    public static void main(String[] args)
    {
        int[] arr = {1, 2, 1, 1, 1, 5, 1};
        int target = 5;
        int left = 0,right = 0;
        int minLength = arr.length + 1;
        int sum = 0;

        while(right < arr.length)
        {
            sum += arr[right];

            while(sum >= target)
            {
                int length = right - left + 1;

                if(length < minLength)
                {
                    minLength = length;
                }
                sum -= arr[left];
                left++;
            }
            right++;
        }
        System.out.println("Minimum Length : " + minLength);
    }
}